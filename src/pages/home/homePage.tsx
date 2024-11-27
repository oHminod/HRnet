import { useState } from "react";
import { departmentsList, statesList } from "../../utils/data";
import useEmployees from "../../hooks/useEmployees";

const HomePage = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { addEmployee } = useEmployees();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(e.currentTarget);

    const form = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      startDate: formData.get("startDate") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      department: formData.get("department") as string,
    };
    console.log("form content", form);
    addEmployee(form);

    e.currentTarget.reset();
    setSelectedState("");
    setSelectedDepartment("");
  };

  return (
    <>
      <div className="border-2 p-6 rounded-xl">
        <h2 className="text-center text-lg font-semibold">Create employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4 py-10">
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-wrap items-center gap-2">
                <span>First Name</span>
                <input
                  name="firstName"
                  className="border-2 p-2 rounded-lg"
                  type="text"
                  placeholder="John"
                />
              </label>
              <label className="flex flex-wrap items-center gap-2">
                <span>Last Name</span>
                <input
                  name="lastName"
                  className="border-2 p-2 rounded-lg"
                  type="text"
                  placeholder="Doe"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-wrap items-center gap-2">
                <span>Date of Birth</span>
                <input
                  name="dateOfBirth"
                  className="border-2 p-2 rounded-lg"
                  type="date"
                />
              </label>
              <label className="flex flex-wrap items-center gap-2">
                <span>Start Date</span>
                <input
                  name="startDate"
                  className="border-2 p-2 rounded-lg"
                  type="date"
                />
              </label>
            </div>
            <h3 className="font-semibold pt-8">Address</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-wrap items-center gap-2">
                <span>Street</span>
                <input
                  name="street"
                  className="border-2 p-2 rounded-lg"
                  type="text"
                  placeholder="123 Main St"
                />
              </label>
              <label className="flex flex-wrap items-center gap-2">
                <span>City</span>
                <input
                  name="city"
                  className="border-2 p-2 rounded-lg"
                  type="text"
                  placeholder="Springfield"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-wrap items-center gap-2">
                <span>State</span>
                <select
                  name="state"
                  className="border-2 p-2 rounded-lg"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="" disabled>
                    Choose State
                  </option>
                  {statesList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-wrap items-center gap-2">
                <span>Zip Code</span>
                <input
                  name="zipCode"
                  className="border-2 p-2 rounded-lg"
                  type="text"
                  placeholder="62704"
                />
              </label>
            </div>
            <h3 className="font-semibold pt-8">Department</h3>
            <label className="flex flex-wrap items-center gap-2">
              <span>Department</span>
              <select
                name="department"
                className="border-2 p-2 rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="" disabled>
                  Choose Department
                </option>
                {departmentsList.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-28 bg-blue-500 text-white p-2 mb-4 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default HomePage;
