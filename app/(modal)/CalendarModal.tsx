import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useCallback, useMemo, useState, forwardRef, useRef } from 'react';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import useExpenseStore from '@/store/useExpenseStore';
import { formateTime } from '@/util/lib';
import { Image } from 'expo-image';


interface CalendarDay {
    dateString: string; // e.g., "2025-08-18"
    day: number;        // e.g., 18
    month: number;      // e.g., 8
    year: number;       // e.g., 2025
    timestamp: number;  // Unix timestamp in milliseconds
}
const INITIAL_DATE = new Date().toISOString().split('T')[0];

const CalendarModal = ({
    setCalendarModalVisible,
}: {
    setCalendarModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const formatMonth = (date: Date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const expenses = useExpenseStore((state) => state.expenses)


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

    const getDay = () => {
        const date = new Date(selected);
        console.log(date);
        return date.toLocaleDateString('en-US', { month: 'short',  year: 'numeric', weekday: 'long' });
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

            <Calendar
                customHeader={CustomHeader}
                style={styles.calendar}
                enableSwipeMonths
                current={INITIAL_DATE}
                onDayPress={onDayPress}
                markedDates={marked}
            />
            <ScrollView>
                <View style={styles.spendListContainer}>
                    <Text style={styles.filterDate}>{getDay()}</Text>
                    {expenses.map((expense) => (
                        <View key={expense.id} style={styles.innerListContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image source={require('../../assets/images/icon.png')} style={{ width: 50, height: 50 }} />
                                <View style={{ gap: 5 }}>
                                    <Text style={{
                                        color: '#333',
                                    }}>{expense.description}</Text>
                                    <Text style={{
                                        color: '#666',
                                        fontSize: 12,
                                    }}>{formateTime(expense.date)}</Text>
                                </View>
                            </View>
                            <Text>{expense.amount}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
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
    spendListContainer: {
        flex: 1,
        gap: 10,
    },
    innerListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8ff',
        borderRadius: 15,
        padding: 10,
        elevation: 1,
        justifyContent: 'space-between',
    },
    filterDate: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
        marginTop: 5,
    },
})
