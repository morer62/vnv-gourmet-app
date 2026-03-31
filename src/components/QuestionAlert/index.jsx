import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';

export default function QuestionAlert({
  visible,
  question,
  options = [],
  selectedValue,
  onChange,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.question}>{question}</Text>

          <RadioButton.Group onValueChange={onChange} value={selectedValue}>
            {options.map((opt) => (
              <View key={opt.value} style={styles.radioRow}>
                <RadioButton value={opt.value} />
                <TouchableOpacity onPress={() => onChange(opt.value)}>
                  <Text>{opt.label}</Text>
                </TouchableOpacity>
                
              </View>
            ))}
          </RadioButton.Group>

          <View style={styles.buttons}>
            <Button onPress={onCancel} >Cancel</Button>
            <Button onPress={onConfirm} >Confirm</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  question: { fontSize: 16, marginBottom: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  buttons: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
