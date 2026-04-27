import Navbar from "./components/Navbar";
import Trending from "./components/Trending";
import NowPlaying from "./components/NowPlaying";
import TopRated from "./components/TopRated";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Trending />
      <NowPlaying />
      <TopRated />
      <Footer />
    </>
  );
}
