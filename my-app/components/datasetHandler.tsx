'use client';

import { useState } from 'react';
import { selectDataset, selectProc, setDatasetLoad, setProcResult, hasData, hasResult } from "../store/datasetSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DatasetHandler() {
  const dispatch = useDispatch();

  const dataLoaded = useSelector(hasData);
  const dataProcessed = useSelector(hasResult);
  const dataset = useSelector(selectDataset);
  const dataResult = useSelector(selectProc);

  const loadData = (data: number[]) => dispatch(setDatasetLoad(data));
  const loadResult = (res: number) => dispatch(setProcResult(res));

  const syncData = () => {
    const data = [1,2,3,4,5,6,7,8,9,10];
    console.log("publishing data!");
    loadData(data);
  };


  return (
    <div>
      <p>Press button to load dataset into application</p>
      <p>There is currently {dataLoaded ? "some" : "no"} data loaded.</p>

      <p>{dataProcessed ? "We have analysed the data and the result is:" : ""}</p><p>{dataResult}</p>
      <button onClick={syncData}>Load Data</button>
    </div>
  );
}