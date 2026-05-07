import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native'
// import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../stores'
import { clearSleepTimer, setSleepTimer } from '../stores/playerSlice'
import { Bluetooth, Timer } from 'lucide-react-native'

const TIMER_OPTIONS = [
    { label: '15 minutes', desc: 'Gently fades out', value: '15', icon: 'schedule' },
    { label: '30 minutes', desc: 'Standard duration', value: '30', icon: 'schedule' },
    { label: '45 minutes', desc: 'Deep sleep preparation', value: '45', icon: 'schedule' },
    { label: '1 hour', desc: 'Extended session', value: '60', icon: 'hourglass-empty' },
]

export default function SleepTimer({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const dispatch = useDispatch();
    const { sleepTimerDuration } = useSelector((state: RootState) => state.player);

    const [selected, setSelected] = useState(sleepTimerDuration || '15')

    if (!visible) return null;

    const handleStart = () => {
        let ms = 0;
        if (selected === '15') ms = 15 * 60 * 1000;
        else if (selected === '30') ms = 30 * 60 * 1000;
        else if (selected === '45') ms = 45 * 60 * 1000;
        else if (selected === '60') ms = 60 * 60 * 1000;

        if (ms > 0) {
            dispatch(setSleepTimer({ timestamp: Date.now() + ms, duration: selected }));
        }
        onClose();
    }

    const handleCancel = () => {
        dispatch(clearSleepTimer());
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.container}>
                {/* Dimmed Background */}
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

                {/* Bottom Sheet */}
                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.headerRow}>
                            <Text style={styles.title}>Sleep Timer</Text>

                            <View style={styles.activeBadge}>
                                <Timer size={14} color="#b90df2" />
                                <Text style={styles.activeText}>ACTIVE</Text>
                            </View>
                        </View>

                        <Text style={styles.subtitle}>
                            Your music will automatically stop after the selected duration.
                        </Text>

                        {/* Options */}
                        <View style={{ marginTop: 20 }}>
                            {TIMER_OPTIONS.map((item) => {
                                const isSelected = selected === item.value

                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.optionCard,
                                            isSelected && styles.optionCardActive,
                                        ]}
                                        onPress={() => setSelected(item.value)}
                                    >
                                        <View style={styles.optionLeft}>
                                            <View
                                                style={[
                                                    styles.iconBox,
                                                    isSelected && styles.iconBoxActive,
                                                ]}
                                            >
                                                <Bluetooth
                                                    
                                                    size={20}
                                                    color={isSelected ? 'white' : 'white'}
                                                />
                                            </View>

                                            <View>
                                                <Text style={styles.optionTitle}>{item.label}</Text>
                                                <Text style={styles.optionDesc}>{item.desc}</Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.radioOuter,
                                                isSelected && styles.radioOuterActive,
                                            ]}
                                        >
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        {/* Footer Buttons */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                                <Text style={styles.startText}>{sleepTimerDuration ? 'Update Timer' : 'Start Timer'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.cancelText}>{sleepTimerDuration ? 'Turn Off Timer' : 'Cancel'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1022',
        justifyContent: 'flex-end',
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },

    sheet: {
        maxHeight: '90%',
        backgroundColor: '#1a0f1d',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },

    handle: {
        alignSelf: 'center',
        width: 50,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 15,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },

    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: 'rgba(185,13,242,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(185,13,242,0.3)',
    },

    activeText: {
        fontSize: 12,
        color: '#b90df2',
        fontWeight: '600',
    },

    subtitle: {
        marginTop: 10,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
    },

    optionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },

    optionCardActive: {
        borderColor: '#b90df2',
        backgroundColor: 'rgba(185,13,242,0.08)',
    },

    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },

    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconBoxActive: {
        backgroundColor: '#b90df2',
    },

    optionTitle: {
        color: 'white',
        fontWeight: '600',
    },

    optionDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },

    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioOuterActive: {
        borderColor: '#b90df2',
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#b90df2',
    },

    footer: {
        marginTop: 25,
    },

    startButton: {
        height: 55,
        borderRadius: 15,
        backgroundColor: '#b90df2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#b90df2',
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },

    startText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    cancelButton: {
        marginTop: 10,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cancelText: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
})