import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useCallback, useMemo, useState, forwardRef, useRef } from 'react';
import { Calendar, CalendarUtils } from 'react-native-calendars';



interface CalendarDay {
    dateString: string; // e.g., "2025-08-18"
    day: number;        // e.g., 18
    month: number;      // e.g., 8
    year: number;       // e.g., 2025
    timestamp: number;  // Unix timestamp in milliseconds
}

const CalendarModal = ({
    setCalendarModalVisible,
}: {
    setCalendarModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const formatMonth = (date: Date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };
    const INITIAL_DATE = new Date().toISOString().split('T')[0]; // today's date in YYYY-MM-DD
    console.log('Initial Date:', INITIAL_DATE);


    const [selected, setSelected] = useState(INITIAL_DATE);
    const [currentMonth, setCurrentMonth] = useState(formatMonth(new Date()));

    const getDate = (count: number) => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const onDayPress = useCallback((day: CalendarDay) => {
        setSelected(day.dateString);
    }, []);


    const customHeaderProps: any = useRef(null);

    const setCustomHeaderNewMonth = (next = false) => {
        const add = next ? 1 : -1;
        const month = new Date(customHeaderProps?.current?.month);
        const newMonth = new Date(month.setMonth(month.getMonth() + add));
        customHeaderProps?.current?.addMonth(add);
        setCurrentMonth(formatMonth(newMonth));
    };
    const moveNext = () => {
        setCustomHeaderNewMonth(true);
    };
    const movePrevious = () => {
        setCustomHeaderNewMonth(false);
    };

    const CustomHeader = forwardRef<View, any>((props, ref) => {
        customHeaderProps.current = props;

        return (
            <View ref={ref} style={styles.customHeader}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#333',
                }}>{currentMonth}</Text>
                <View style={styles.navigationContainer}>
                    <TouchableOpacity onPress={movePrevious}>
                        <MaterialIcons name="chevron-left" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={moveNext}>
                        <MaterialIcons name="chevron-right" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    });
    CustomHeader.displayName = "CustomHeader";

    const marked = useMemo(() => {
        return {
            [getDate(-2)]: {
                dotColor: 'red',
                marked: true
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'black',
                selectedTextColor: 'white'
            }
        };
    }, [selected]);


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => setCalendarModalVisible(false)} style={styles.iconContainer}>
                    <MaterialIcons name="cancel" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Calendar View</Text>
            </View>

            <View>
                <Calendar
                    customHeader={CustomHeader}
                    style={styles.calendar}
                    enableSwipeMonths
                    current={INITIAL_DATE}
                    onDayPress={onDayPress}
                    markedDates={marked}
                />
            </View>
        </View>
    )
}

export default CalendarModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        left: 0,
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    calendar: {
        marginBottom: 10
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        alignItems: 'center',
    },
    navButton: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    currentMonthText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 10,
    },
})
