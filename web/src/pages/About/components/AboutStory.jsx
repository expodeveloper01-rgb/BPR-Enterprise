import Container from "@/components/container";
import { assets } from "../assets";

const StoryPage = () => {
  return (
    <section className="py-20 bg-white">
      <Container className="px-4 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
            Our Journey
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Uncle Brew began with a simple idea: to bring people together over
            delicious food made with love. From our humble beginnings to
            becoming a favorite local spot, our journey has always been fueled
            by a passion for great flavors and an unwavering commitment to
            quality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <img
            src={assets.story_one}
            alt="Uncle Brew's Beginnings"
            className="w-full sm:w-1/2 max-w-md mx-auto rounded-3xl object-cover h-64 sm:h-80 shadow-xl"
          />
          <img
            src={assets.story_two}
            alt="Behind the Scenes"
            className="w-full sm:w-1/2 max-w-md mx-auto rounded-3xl object-cover h-64 sm:h-80 shadow-xl"
          />
        </div>
      </Container>
    </section>
  );
};

export default StoryPage;
