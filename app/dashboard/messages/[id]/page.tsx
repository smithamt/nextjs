function Messages({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen p-2">
      <p className="font-bold text-lg">Messages Hello Hello</p>
      {params.id}
    </div>
  );
}

export default Messages;
