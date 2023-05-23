import Wordle from "@/components/Wordle";

export default function Home() {
  return (
    <div>
      <Wordle word={"example"} maxAttempts={5} />
    </div>
  );
}
