import { COLORS } from '@/constants/Color';
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const SafeScreen = ({ children }: { children: React.ReactNode }) => {

    const insets = useSafeAreaInsets();

    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1,
            backgroundColor: COLORS.light.background
        }}>
            {children}
        </View>
    )
}

export default SafeScreen