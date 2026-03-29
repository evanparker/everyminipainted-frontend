import ManufacturerForm from "./manufacturerForm";

const ManufacturerEdit = () => {
   return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Edit Manufacturer
      </h1>
      <ManufacturerForm mode="edit" />
    </>
  );
};

export default ManufacturerEdit;
