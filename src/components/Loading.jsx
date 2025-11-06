import Lottie from "lottie-react";
import animationData from "../assets/truck.json";

export default function Loader() {
  return (
    <div style={styles.loader}>
      <div style={{ width: 200, height: 200 }}>
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
}

const styles = {
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
};
