import EditableFeatures from './components/EditableFeatures';
import { EditableHeader } from './components/EditableHeader';
import { EditableInstituteMotto } from './components/EditableInstituteMotto';
import EditableNewsNEvents from './components/EditableNewsNEvents';
import EditableSlider from './components/slider/EditableSlider';

export default function HomePage() {
  return (
    <section className="bg-white space-y-4">
      <EditableHeader />
      <EditableSlider />
      <EditableInstituteMotto />
      <EditableFeatures />
      <EditableNewsNEvents />
      {/* <AchievementsEditable /> */}
    </section>
  );
}
