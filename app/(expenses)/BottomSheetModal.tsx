// ExpenseBottomSheet.tsx
import React, { forwardRef } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';

interface ExpenseBottomSheetProps {
    expense: { id: string; description: string; amount: number; date: string; category: string } | null;
}

const ExpenseBottomSheet = forwardRef<BottomSheetModal, ExpenseBottomSheetProps>(
    ({ expense }, ref) => {

        const headerHeight = useHeaderHeight();
        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={['100%']}
                topInset={headerHeight}

            >
                <BottomSheetView style={styles.contentContainer}>
                    {expense ? (
                        <View>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                marginBottom: 10
                            }}>
                                Expense transactions details
                            </Text>
                            <Text style={styles.title}>{expense.description}</Text>
                            <Text style={{
                                fontSize: 35,
                                fontWeight: 'bold',
                            }}>${expense.amount}</Text>
                            <View style={{ borderBottomColor: 'black' }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text>Transaction Category</Text>
                                <Text>{expense.category}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text>Transaction Date</Text>
                                <Text style={styles.date}>{expense.date}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                T<TouchableOpacity>
                                    <Text style={{ color: 'blue' }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={{ color: 'red' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text>No expense selected</Text>
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    amount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'green',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
});

ExpenseBottomSheet.displayName = 'ExpenseBottomSheet';
export default ExpenseBottomSheet;
