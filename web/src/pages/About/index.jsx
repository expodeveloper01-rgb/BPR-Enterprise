import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { BookHeart, Salad, SmilePlus } from "lucide-react";
import StoryPage from "./components/AboutStory";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#ffffff10,transparent_60%)]" />
        <Container className="px-4 md:px-12 py-16 md:py-24">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
            <div className="flex flex-col gap-5 items-start flex-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                About Uncle Brew
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Where Every Sip Tells a Story
              </h1>
              <p className="text-base text-neutral-400 leading-relaxed max-w-lg">
                Join us on a flavorful journey where every bite brings joy.
                Follow us on social media and stay updated with our latest
                delights!
              </p>
              <Button className="bg-white text-black hover:bg-neutral-100 rounded-full px-6 mt-2">
                Explore Our Story
              </Button>
            </div>

            <div className="flex-1 w-full max-w-sm md:max-w-none">
              <img
                src="/assets/img/about/about-bg.jpg"
                alt="About Uncle Brew"
                className="w-full h-64 md:h-80 rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Story section */}
      <StoryPage />

      {/* Values section */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4 md:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              At Uncle Brew, we don&apos;t just serve food; we serve
              experiences. From the freshest ingredients to the most vibrant
              flavors, we ensure every meal is a celebration of taste!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="shadow-sm rounded-2xl border-none bg-white p-8 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <Salad className="w-6 h-6 text-neutral-700" />
              </div>
              <CardTitle className="text-neutral-800">Fresh Ingredients</CardTitle>
              <CardDescription>
                Every dish is crafted with the finest, freshest ingredients to
                bring you an unforgettable taste.
              </CardDescription>
            </Card>

            <Card className="shadow-sm rounded-2xl border-none bg-white p-8 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <BookHeart className="w-6 h-6 text-neutral-700" />
              </div>
              <CardTitle className="text-neutral-800">Exceptional Flavor</CardTitle>
              <CardDescription>
                Our recipes are infused with creativity and passion, resulting
                in flavors that delight your palate.
              </CardDescription>
            </Card>

            <Card className="shadow-sm rounded-2xl border-none bg-white p-8 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <SmilePlus className="w-6 h-6 text-neutral-700" />
              </div>
              <CardTitle className="text-neutral-800">Fun Dining</CardTitle>
              <CardDescription>
                We believe dining should be fun! Enjoy great food, great
                company, and great times at Uncle Brew.
              </CardDescription>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;

