import ImageCollectionModel from "@/models/imagescollections/model";
import PhotoHeader from "./_components/header";
import Images from "./images";

async function PhotoDetail({ params }: { params: { id: string } }) {
  const data = await ImageCollectionModel.findById(params.id).populate(
    "author",
    "profile name employeeId nickname position department"
  );

  return (
    <div className="h-screen w-full">
      <PhotoHeader />
      <Images data={data} />
    </div>
  );
}

export default PhotoDetail;
