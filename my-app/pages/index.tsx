import type { NextPage } from "next";
import DatasetHandler from '../components/datasetHandler'
import { useDispatch, useSelector } from "react-redux";

const Home: NextPage = () => {
  return (
    <div>
    <h1>My App</h1>
    <div>
      <DatasetHandler />
    </div>
    </div>
  );
};

export default Home;
