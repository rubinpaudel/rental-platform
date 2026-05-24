// Shared shape every wizard step screen accepts.
//
//   mode='wizard' — forward-only flow; no back button, sticky CTA reads
//                   "Doorgaan", optional steps render a Skip CTA.
//   mode='edit'   — section-edit entry from the overview; back button
//                   shown, sticky CTA reads "Opslaan", no Skip.

export interface StepScreenProps {
  mode: 'wizard' | 'edit';
}
