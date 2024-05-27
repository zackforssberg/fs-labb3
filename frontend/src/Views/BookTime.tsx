import TeeTimes from "../Components/TeeTimes";
import Footer from "../Components/Footer";
import Event from "../Components/Event";

function BookTime() {
  return (
    <>
      <TeeTimes value={true} />
      <Event />
      <Footer />
    </>
  );
}

export default BookTime;
