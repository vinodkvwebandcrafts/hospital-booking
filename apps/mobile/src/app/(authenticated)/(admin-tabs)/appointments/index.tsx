import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import { useAppointments } from '@/hooks/useAppointments';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/config/constants';

const FILTERS = ['All', 'Scheduled', 'Completed', 'Cancelled'] as const;
type Filter = (typeof FILTERS)[number];

function filterToStatus(f: Filter): string | undefined {
  switch (f) {
    case 'All':
      return undefined;
    case 'Scheduled':
      return 'SCHEDULED';
    case 'Completed':
      return 'COMPLETED';
    case 'Cancelled':
      return 'CANCELLED';
  }
}

export default function AdminAppointmentsListScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const status = filterToStatus(filter);
  const { data, isLoading } = useAppointments(status ? { status } : undefined);

  const appointments = data?.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Appointments</Text>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

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
              showDoctor
              onPress={() =>
                router.push(
                  `/(authenticated)/(admin-tabs)/appointments/${item.id}` as never,
                )
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState title="No Appointments" message="No appointments match the current filter." />
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
  chips: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
});
