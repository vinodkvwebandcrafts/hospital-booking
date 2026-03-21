import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import { useAppointments } from '@/hooks/useAppointments';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/config/constants';

const SEGMENTS = ['Today', 'Upcoming', 'Past'] as const;
type Segment = (typeof SEGMENTS)[number];

function segmentToFilter(segment: Segment) {
  const today = new Date().toISOString().split('T')[0];
  switch (segment) {
    case 'Today':
      return { date: today };
    case 'Upcoming':
      return { status: 'SCHEDULED' };
    case 'Past':
      return { status: 'COMPLETED' };
  }
}

export default function AppointmentsListScreen() {
  const [segment, setSegment] = useState<Segment>('Today');
  const { data, isLoading } = useAppointments(segmentToFilter(segment));

  const appointments = data?.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Appointments</Text>

      {/* Segment Control */}
      <View style={styles.segments}>
        {SEGMENTS.map((s) => (
          <Pressable
            key={s}
            onPress={() => setSegment(s)}
            style={[styles.segment, segment === s && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, segment === s && styles.segmentTextActive]}>
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={() =>
                router.push(
                  `/(authenticated)/(doctor-tabs)/appointments/${item.id}` as never,
                )
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No Appointments"
              message={`No ${segment.toLowerCase()} appointments found.`}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  segments: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  segmentActive: {
    backgroundColor: COLORS.white,
  },
  segmentText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.primary,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
});
