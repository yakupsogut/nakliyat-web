export default async function SeccPage({
    params
  }: {
    params: Promise<{ secc: string }>;
  }) {
    const { secc } = await params;
    return (
        <div>
            <h1>{secc}</h1>
        </div>
    )   
  }