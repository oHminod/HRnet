// homePage.tsx
import { useState } from "react";
import { departmentsList, statesList } from "../../utils/data";
import useEmployees from "../../hooks/useEmployees";
import { DatePicker, Modal, CustomSelect } from "hrnet-components-ohm";
import { v4 as uuidv4 } from "uuid";
import Input from "../../components/input";

const HomePage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState("");
  const { addEmployee } = useEmployees();
  const [resetKey, setResetKey] = useState(0);
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      id: uuidv4(),
    };

    if (form.state === "" || form.department === "") {
      setError("Please select a state and department");
      return;
    }
    const today = new Date();
    const birthDate = new Date(form.dateOfBirth);
    const startDate = new Date(form.startDate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      form.dateOfBirth === "" ||
      form.startDate === "" ||
      form.dateOfBirth.length !== 10 ||
      form.startDate.length !== 10 ||
      birthDate >= startDate ||
      age < 18 ||
      (age === 18 && monthDiff < 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      setError(
        "Please select a valid date of birth and start date. Employee must be at least 18 years old."
      );
      return;
    }
    if (error) setError("");
    addEmployee(form);

    e.currentTarget.reset();
    handleReset();
    setIsOpenModal(true);
  };

  const handleReset = () => {
    setZipCode("");
    setResetKey((prev) => prev + 1); // On force le remount
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 5 && !isNaN(Number(value))) {
      setZipCode(value);
    }
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          title="Success"
          message="Employee Created!"
          setIsOpenModal={setIsOpenModal}
        />
      )}
      <div className="border-2 p-6 rounded-xl">
        <h2 className="text-center text-lg font-semibold">Create employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4 py-10">
            <div className="flex flex-wrap gap-4">
              <Input label="First Name" name="firstName" placeholder="John" />
              <Input label="Last Name" name="lastName" placeholder="Doe" />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-wrap items-center gap-2">
                <span>Date of Birth</span>
                <DatePicker name="dateOfBirth" key={`date1-${resetKey}`} />
              </label>
              <label className="flex flex-wrap items-center gap-2">
                <span>Start Date</span>
                <DatePicker name="startDate" key={`date2-${resetKey}`} />
              </label>
            </div>
            <h3 className="font-semibold pt-8">Address</h3>
            <div className="flex flex-wrap gap-4">
              <Input label="Street" name="street" placeholder="123 Main St" />
              <Input label="City" name="city" placeholder="Springfield" />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-wrap items-center gap-2">
                <span>State</span>
                <CustomSelect
                  options={statesList}
                  placeholder="Choose State"
                  name="state"
                  key={`select1-${resetKey}`}
                />
              </label>
              <Input
                label="Zip Code"
                name="zipCode"
                placeholder="62704"
                value={zipCode}
                onChange={handleZipCodeChange}
              />
            </div>
            <h3 className="font-semibold pt-8">Department</h3>
            <label className="flex flex-wrap items-center gap-2">
              <span>Department</span>
              <CustomSelect
                options={departmentsList}
                placeholder="Choose Department"
                name="department"
                key={`select2-${resetKey}`}
              />
            </label>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-center w-full">
            <button
              type="reset"
              className="w-28 bg-gray-600 text-white p-2 mb-4 rounded-lg mr-4 hover:bg-gray-800"
              onClick={handleReset}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-28 bg-blue-600 text-white p-2 mb-4 rounded-lg hover:bg-blue-800"
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
