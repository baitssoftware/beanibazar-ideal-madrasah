const Contact = () => {
  return (
    <section>
      <h2 className="heading">Contact Us</h2>
      <div className="grid grid-cols-3 gap-4 py-6">
        <div className="px-10 py-6 border">
          <h2 className="text-2xl font-semibold underline underline-offset-8 pb-4">
            Institute Address:
          </h2>
          <p className="">Bijoy International School 183/A, East Kafrul, Dhaka</p>
        </div>
        <div className="px-10 py-6 border">
          <h2 className="text-2xl font-semibold underline underline-offset-8 pb-4">
            Web & Email Address:
          </h2>
          <p className="">bisbd2004@gmail.com</p>
        </div>
        <div className="px-10 py-6 border">
          <h2 className="text-2xl font-semibold underline underline-offset-8 pb-4">
            Contact Number:
          </h2>
          <p className="">+88 01981 580307</p>
        </div>
      </div>
      <div className="pb-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7301.683497417456!2d90.387283!3d23.788649!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c73effffffef%3A0x8519b2b620ab08e!2sBijoy%20International%20School!5e0!3m2!1sen!2sbd!4v1736222497913!5m2!1sen!2sbd"
          className="w-full"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;
