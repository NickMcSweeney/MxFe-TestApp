import type { NextPage } from "next";
import DatasetHandler from '../components/datasetHandler'
import { useDispatch, useSelector } from "react-redux";
import DataProcessingHandler from "@/components/dataProcessingHandler";

const Home: NextPage = () => {

  return (
    <div>
    <h1>My App</h1>
    <div>
      <DatasetHandler />
      <DataProcessingHandler />
    </div>
    </div>
  );
};

export default Home;
