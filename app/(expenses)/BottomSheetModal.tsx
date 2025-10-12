import React, { forwardRef, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { formatDate, getDeviceCurrencySymbol } from '@/util/lib';
import BlurredBackground from '@/components/BlurredBackground';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import useExpenseStore from '@/store/useExpenseStore';
import useAuthStore from '@/store/useAuthStore';
import { signOutFromGoogle } from "@/util/googleAuth"
import ExpenseEditModal from '../(modal)/ExpenseEditModal';

interface ExpenseBottomSheetProps {
    expenseId: string | undefined;
}

const ExpenseBottomSheet = forwardRef<BottomSheetModal, ExpenseBottomSheetProps>(
    ({ expenseId }, ref) => {


        const expense = useExpenseStore(
            (state) => state.expenses.find((e) => e.id === expenseId) || null
        );

        const [expenseEditModal, setExpenseEditModal] = useState(false)

        const deleteExpense = useExpenseStore((state) => state.deleteExpense);

        const headerHeight = useHeaderHeight()

        const { logout } = useAuthStore()

        const deleteExpenseAndCloseSheet = (expenseId: string) => {
            deleteExpense(expenseId)
            if (ref && 'current' in ref) {
                ref.current?.close();
            }
        }

        return (
            <BottomSheetModal
                ref={ref}
                topInset={headerHeight}
                backdropComponent={BlurredBackground}
                name='bottomsheetexpensemodal'
                detached
                bottomInset={20}
                style={{
                    marginHorizontal: 10
                }}
            >
                <BottomSheetView style={styles.contentContainer}>
                    {expense ? (
                        <View style={{ paddingHorizontal: 20, width: '100%', flex: 1, gap: 5 }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginBottom: 0,
                                margin: "auto"
                            }}>
                                Expense transactions details
                            </Text>
                            <Text style={styles.title}>{expense.description}</Text>
                            <Text style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                            }}>{getDeviceCurrencySymbol()}{expense.amount}</Text>

                            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{
                                    color: '#666',
                                }}>Transaction Category</Text>
                                <Text>{expense.category}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{
                                    color: '#666',
                                }}>Transaction Date</Text>
                                <Text style={styles.date}>{formatDate(expense.date)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, flex: 1, gap: 10, marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => setExpenseEditModal(true)} style={styles.modifyButton}>
                                    <FontAwesome5 name="edit" size={18} color="black" />
                                    <Text style={{ color: 'black', fontSize: 14 }}>Modify</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteExpenseAndCloseSheet(expense.id)} style={styles.deleteButton}>
                                    <MaterialCommunityIcons name="delete-forever-outline" size={20} color="red" />
                                    <Text style={{ color: 'red', fontSize: 14 }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text>No expense selected</Text>
                    )}
                </BottomSheetView>
                <Modal
                    visible={expenseEditModal}
                    transparent
                    animationType='slide'
                    onRequestClose={() => setExpenseEditModal(false)}>
                    <ExpenseEditModal ExpenseDetailsProps={expense} setExpenseEditModal={setExpenseEditModal} />
                </Modal>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 15,
    },
    amount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'green',
    },
    date: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    modifyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#d6dfe0ff',
        borderRadius: 5,
        marginTop: 10,
        gap: 5,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f8d7daff',
        borderRadius: 5,
        marginTop: 10,
        gap: 5,
    }
});

ExpenseBottomSheet.displayName = 'ExpenseBottomSheet'
export default ExpenseBottomSheet
