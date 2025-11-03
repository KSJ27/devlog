import PostsCarousel from "@/components/common/PostsCarousel";

export default function Home() {
  return (
    <div className="container">
      <div>
        <h2 className="font-bold text-2xl">최신글</h2>
        <PostsCarousel />
      </div>
    </div>
  );
}
