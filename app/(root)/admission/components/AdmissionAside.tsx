import Notice from '../../components/home/Notice';
import ImportantLink from '../../components/shared/ImportentLink';

const AdmissionAside = () => {
  return (
    <div className="">
      <div className="border-s p-4 pt-0  sticky top-20">
        <Notice />
      </div>
      <div className="">
        <ImportantLink />
      </div>
    </div>
  );
};

export default AdmissionAside;
