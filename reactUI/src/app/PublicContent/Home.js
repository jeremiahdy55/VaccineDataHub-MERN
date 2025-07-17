import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getVaccines } from "../ReduxStore/Vaccine/VaccineAction";
import { getStrippedAppointments } from "../ReduxStore/Appointments/AppointmentAction";
import { getDemographicData } from "../ReduxStore/DemographicData/DemographicDataAction";
import PieChart from "./ReportingComponents/PieChart";
import BarChart from "./ReportingComponents/BarChart";
import VaccineReportCard from "./ReportingComponents/VaccineReportCard";
import DataCarousel from "./ReportingComponents/DataCarousel";
const Home = () => {
  // hooks
  const dispatch = useDispatch();

  // get data from store
  const vaccines = useSelector((state) => state.vaccineReducer.vaccines) || [];
  const demographicData =
    useSelector((state) => state.demographicDataReducer.demographicData) || [];
  const appointmentsRaw =
    useSelector((state) => state.appointmentReducer.appointments) || [];

  // populate data from the vaccine field
  const appointments = appointmentsRaw.map((appt) => {
    const vaccine = vaccines.find((v) => v._id === appt.vaccineId);
    return {
      ...appt,
      vaccine,
    };
  });

  // repopulate the store
  useEffect(() => {
    dispatch(getStrippedAppointments());
    dispatch(getVaccines());
    dispatch(getDemographicData());
  }, [dispatch]);

  // === Chart Data/Constants ===
  const ageGroupOrder = [
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65-74",
    "75-84",
    "85-90+",
  ];
  const populationSize = demographicData.length;

  // groupBy objects (fields contain an array of appointment objects)
  const groupedByProfession = groupBy(
    demographicData,
    (patient) => patient.profession
  );
  const groupedByAge = groupBy(demographicData, (patient) =>
    sortIntoAgeGroup(patient.age)
  );
  const groupedByGender = groupBy(demographicData, (patient) => patient.gender);

  // countBy objects (fields contain an integer value)
  const countByMedicalHistoryTerms = demographicData.reduce(
    (accumulator, patient) => {
      for (const key of patient.medicalHistory) {
        if (!accumulator[key]) accumulator[key] = 0; // initialize count at 0 if it doesn't exist
        accumulator[key]++;
      }
      return accumulator;
    },
    {}
  );
  const d3CountByMedicalHistory = Object.entries(
    countByMedicalHistoryTerms
  ).map(([key, value]) => ({ label: key, value }));

  // get all completed appointments from up-to today, sorted by earliest to latest (ascending)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedAppointments = appointments
    .filter((appt) => {
      const apptDate = new Date(appt.appointmentDate);
      apptDate.setHours(0, 0, 0, 0);
      return apptDate <= today && appt.approved && appt.paid;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  // calculate the number of days its been since the earliest appointment
  const diffDays =
    completedAppointments.length > 0
      ? Math.floor(
          (new Date() - new Date(completedAppointments[0].appointmentDate)) /
            (1000 * 60 * 60 * 24)
        )
      : -1; // sentinel value
  const avgDosesPerDay = completedAppointments.length / diffDays; // either 0 or a positive value

  // group appt objects by vaccine ID
  const apptsGroupedByVaccineId = groupBy(
    completedAppointments,
    (appt) => appt.vaccineId
  );
  const vaccineNames = vaccines.reduce((accumulator, vaccine) => {
    accumulator.push(vaccine?.name);
    return accumulator;
  }, []);

  // count number of patients that have received at least one dose of {vaccine name}
  const vaccineOneDose = {};
  for (const [vaccineId, appts] of Object.entries(apptsGroupedByVaccineId)) {
    const userIds = new Set(appts.map((appt) => appt.userId));
    const vaccine = vaccines.find((v) => v._id === vaccineId);
    vaccineOneDose[vaccine?.name] = userIds.size;
  }

  // count number of patients that have received a {doses required} amount of doses of {vaccine name}
  const vaccineFullDose = {};
  for (const [vaccineId, appts] of Object.entries(apptsGroupedByVaccineId)) {
    const vaccine = vaccines.find((v) => v._id === vaccineId);
    const requiredDosage = vaccine?.dosesRequired;
    const userIds = new Set(appts.map((appt) => appt.userId));
    for (const uid of userIds) {
      const vaccineDosesReceived = appts.filter((a) => a.userId === uid).length;
      if (vaccineDosesReceived >= requiredDosage) {
        if (!vaccineFullDose[vaccine?.name]) vaccineFullDose[vaccine?.name] = 0;
        vaccineFullDose[vaccine?.name]++;
      }
    }
  }

  // === Helper functions for aggregating/transforming data ===
  // define helper groupBy function to aggregate demographicData
  // by values in a given field (e.g. age, profession, gender, etc.)
  function groupBy(arr, keyFn) {
    return arr.reduce((accumulator, item) => {
      // get the field value to group by
      const key = keyFn(item);
      // if the aggregate array doesn't yet exist, create it
      if (!accumulator[key]) accumulator[key] = [];
      // push the array element into the aggregate array
      accumulator[key].push(item);
      // return the object of arrays, where each field is a different value from keyFn
      return accumulator;
    }, {});
  }

  // define helper function to transform groupBy return objects into d3-ready format
  function d3DataFormat(arr) {
    return Object.entries(arr).map(([key, value]) => ({
      label: key,
      value: value.length,
    }));
  }

  // define helper function to sort demographicDate records by patient age
  function sortIntoAgeGroup(age) {
    switch (true) {
      case age >= 18 && age <= 24:
        return "18-24";
      case age >= 25 && age <= 34:
        return "25-34";
      case age >= 35 && age <= 44:
        return "35-44";
      case age >= 45 && age <= 54:
        return "45-54";
      case age >= 55 && age <= 64:
        return "55-64";
      case age >= 65 && age <= 74:
        return "65-74";
      case age >= 75 && age <= 84:
        return "75-84";
      case age >= 85:
        return "85-90+";
      default:
        return "Under 18";
    }
  }

  const carouselData = [
    {message: ["Average doses per day"], stat:[avgDosesPerDay], decoration:["bold"], isPercentage:[false] }
  ];
  let carouselMessage = [];
  let carouselStat = [];
  let carouselDecoration = [];
  let carouselPercentageBool = [];
  for (const gender in groupedByGender) {
    carouselMessage.push(gender);
    carouselStat.push(groupedByGender[gender].length);
    carouselDecoration.push("bold");
    carouselPercentageBool.push(true);
  }
  carouselData.push(
    {label: "Gender Distribution", message: carouselMessage, stat:carouselStat, decoration:carouselDecoration, isPercentage: carouselPercentageBool }
  )
  carouselMessage = [];
  carouselStat = [];
  carouselDecoration = [];
  carouselPercentageBool = [];
  for (const age of d3DataFormat(groupedByAge).sort((a, b) => {
    return (
      ageGroupOrder.indexOf(a.label) - ageGroupOrder.indexOf(b.label)
    );
  })) {
    carouselMessage.push(age.label);
    carouselStat.push(age.value);
    carouselDecoration.push("bold");
    carouselPercentageBool.push(true);
  }
  carouselData.push(
    {label: "Age Distribution", message: carouselMessage, stat:carouselStat, decoration:carouselDecoration, isPercentage: carouselPercentageBool }
  )
  return (
    <>
    <div className="row mb-4" >
      <DataCarousel style={{minHeight:"8rem"}} data={carouselData}/>
    </div>
      <div className="row mb-4">
        <div className="col-md-4 mt-5" style={{ height: "33vh" }}>
          <BarChart
            data={d3DataFormat(groupedByAge).sort((a, b) => {
              return (
                ageGroupOrder.indexOf(a.label) - ageGroupOrder.indexOf(b.label)
              );
            })}
            populationSize={populationSize}
            chartTitle={"Age Distribution"}
          />
        </div>
        <div className="col-md-4 mt-5" style={{ height: "33vh" }}>
          <PieChart
            data={d3DataFormat(groupedByGender)}
            populationSize={populationSize}
            chartTitle={"Gender Distribution"}
          />
        </div>
        <div className="col-md-4 mt-5" style={{ height: "33vh" }}>
          <BarChart
            data={d3DataFormat(groupedByProfession)}
            populationSize={populationSize}
            chartTitle={"Profession Distribution"}
          />
        </div>
      </div>
      <div style={{ height: "2rem" }}></div>
      <div className="row mb-4">
        <div className="col-md-4 mt-5 ms-3" style={{ height: "66vh" }}>
          <BarChart
            data={d3CountByMedicalHistory.sort((a, b) =>
              a.label.localeCompare(b.label)
            )}
            populationSize={populationSize}
            chartTitle={"Common Medical History Conditions"}
          />
        </div>
        <div className="col-md-7 mt-5 ms-5" style={{ height: "66vh" }}>
          <div className="vaccine-reporting-grid">
            {vaccineNames.map((vaccineName) => {
              const oneDoseCount = vaccineOneDose[vaccineName] || 0;
              const fullDoseCount = vaccineFullDose[vaccineName] || 0;

              return (
                <VaccineReportCard
                  key={vaccineName}
                  name={vaccineName}
                  oneDosePercent={(oneDoseCount / populationSize) * 100}
                  fullDosePercent={(fullDoseCount / populationSize) * 100}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
