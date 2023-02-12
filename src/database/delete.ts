import { Transaction } from 'react-native-sqlite-storage';

export const deleteDatabase = (transaction: Transaction) => {
  transaction.executeSql('DROP TABLE IF EXISTS Messages;');
  transaction.executeSql('DROP TABLE IF EXISTS Users;');
  transaction.executeSql('DROP TABLE IF EXISTS Version;');
};
