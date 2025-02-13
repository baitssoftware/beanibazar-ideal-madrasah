import AboutAside from './components/AboutAside';

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <div className="grid grid-cols-9 gap-4 py-4">
        <div className="lg:col-span-6 col-span-9">{children}</div>
        <div className="col-span-3 hidden lg:block">
          <AboutAside />
        </div>
      </div>
    </>
  );
};

export default layout;
