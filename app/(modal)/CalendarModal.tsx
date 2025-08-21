import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useCallback, useMemo, useState, forwardRef, useRef } from 'react';
import { Calendar } from 'react-native-calendars';
import useExpenseStore from '@/store/useExpenseStore';
import { formatTime, getDeviceCurrencySymbol } from '@/util/lib';
import { categories } from './CategoryModal';


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

    const filterExpensesByDate = useCallback((date: string) => {
        return expenses.filter((expense) => {
            const expenseDate = new Date(expense.date).toISOString().split('T')[0];
            return expenseDate === date;
        });
    }, [expenses]);

    const [selected, setSelected] = useState(INITIAL_DATE);

    const [currentMonth, setCurrentMonth] = useState(formatMonth(new Date()));
    const [totalCost, setTotalCost] = useState(0)

    const filteredExpenses = useMemo(() => filterExpensesByDate(selected), [filterExpensesByDate, selected]);


    const onDayPress = useCallback((day: CalendarDay) => {
        setSelected(day.dateString);
    }, []);

    useMemo(() => {
        const total = filterExpensesByDate(selected).reduce((acc, expense) => acc + expense.amount, 0);
        setTotalCost(total);
    }, [selected, filterExpensesByDate]);


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

        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Saturday
        const day = date.getDate(); // 3
        const month = date.toLocaleDateString('en-US', { month: 'short' }); // Oct

        return `${weekday}, ${day} ${month}`;
    };

    const weekdays = Array.from({ length: 7 }).map((_, i) => {
        // Start from Sunday (0) and go through the week
        const date = new Date(1970, 0, 4 + i); // Jan 4, 1970 was a Sunday
        return date.toLocaleDateString(undefined, { weekday: 'short' });
    });



    const CustomHeader = forwardRef<View, any>((props, ref) => {
        customHeaderProps.current = props;

        return (
            <View>
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
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}>
                    {weekdays.map((day) => (
                        <Text style={{ fontWeight: "bold", margin: 'auto' }} key={day}>{day}</Text>
                    ))}
                </View>
            </View>
        );
    });
    CustomHeader.displayName = "CustomHeader";

    const marked = useMemo(() => {
        // Create an object where keys are date strings like "2025-08-18"
        const marks: Record<string, any> = {};

        expenses.forEach((expense) => {
            const date = expense.date.split("T")[0]; // ensure format YYYY-MM-DD
            if (!marks[date]) {
                marks[date] = { marked: true, dotColor: 'red' }; // first expense for this day
            }
        });

        // add currently selected day styling
        if (selected) {
            marks[selected] = {
                ...(marks[selected] || {}),
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'black',
                selectedTextColor: 'white',
            };
        }

        return marks;
    }, [expenses, selected]);


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
                hideExtraDays
            />
            <ScrollView>
                <View style={styles.spendListContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.filterDate}>{getDay()}</Text>
                        <Text style={styles.filterDate}>{getDeviceCurrencySymbol()}{totalCost}</Text>
                    </View>
                    {filteredExpenses.map((expense) => (
                        <View key={expense.id} style={styles.innerListContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ fontSize: 25 }}>{categories.find((category) => category.name === expense.category)?.emoji}</Text>
                                <View style={{ gap: 1 }}>
                                    <Text style={{
                                        color: '#333',
                                    }}>{expense.description}</Text>
                                    <Text style={{
                                        color: '#666',
                                        fontSize: 10,
                                    }}>{formatTime(expense.date)}</Text>
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
        paddingHorizontal: 20,
        backgroundColor: '#f8f8ff',
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
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 30,
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
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        justifyContent: 'space-between',
    },
    filterDate: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
        marginTop: 5,
    },
})
