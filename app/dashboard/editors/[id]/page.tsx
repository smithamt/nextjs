import TextEditorModel from "@/models/editors/model";

async function EditorDetail({ params }: { params: { id: string } }) {
  const editor = await TextEditorModel.findOne({
    _id: params.id,
    isPublic: true,
  });

  return (
    <div className="h-screen overflow-y-auto">
      <p>Editor Detail</p>
      <p>{params.id}</p>
      <div dangerouslySetInnerHTML={{ __html: editor.content }} />
    </div>
  );
}

export default EditorDetail;
