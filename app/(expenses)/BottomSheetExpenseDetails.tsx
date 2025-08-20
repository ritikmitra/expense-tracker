import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
    useEffect
} from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import { SharedValue } from 'react-native-reanimated';
import { View } from 'react-native';
import BlurredBackground from '@/components/BlurredBackground';


interface LocationDetailsBottomSheetProps {
    index: SharedValue<number>;
    position: SharedValue<number>;
}

export interface LocationDetailsBottomSheetMethods {
    present: (location: Location) => void;
}

const SNAP_POINTS = ['100%'];


const LocationDetailsBottomSheet = forwardRef<LocationDetailsBottomSheetMethods, LocationDetailsBottomSheetProps>(
    ({ index, position }, ref) => {
        //#region refs
        const bottomSheetRef = useRef<BottomSheetModal>(null);
        //#endregion

        //#region state
        const [selectedLocation, setSelectedLocation] = useState<Location>();
        //#endregion

        //#region hooks
        const headerHeight = useHeaderHeight();
        //#endregion

        //#region callbacks
        const handleOnDismiss = useCallback(() => {
            setSelectedLocation(undefined);
        }, []);
        //#endregion

        //#region effects
        useImperativeHandle(ref, () => ({
            present: (location: Location) => {
                setSelectedLocation(location);
            },
        }));

        useEffect(() => {
            if (selectedLocation) {
                bottomSheetRef.current?.present();
            }
        }, [selectedLocation]);
        //#endregion

        return (
            <BottomSheetModal
                ref={bottomSheetRef}
                key="PoiDetailsSheet"
                name="PoiDetailsSheet"
                snapPoints={SNAP_POINTS}
                topInset={headerHeight}
                animatedIndex={index}
                animatedPosition={position}
                // handleComponent={BlurredHandle}
                backgroundComponent={BlurredBackground}
                onDismiss={handleOnDismiss}
            >
                <View>
                    Text
                </View>
            </BottomSheetModal>
        );
    }
);

LocationDetailsBottomSheet.displayName = 'LocationDetailsBottomSheet';

export default LocationDetailsBottomSheet;