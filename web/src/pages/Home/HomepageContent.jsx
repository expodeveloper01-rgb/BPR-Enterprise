import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PopularContent } from "@/components/popular-content";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Circle,
  Coffee,
  CreditCard,
  CupSoda,
  FileHeart,
  LogIn,
  Timer,
  Truck,
} from "lucide-react";
import AdPopup from "@/components/AdPopup";
import food from "/assets/img/Food.png";
import logo from "/assets/img/uncle-brew.png";
import uc_model from "/assets/img/uc-model.png";
import qr_code from "/assets/img/qr-code.png";
import ios_icon from "/assets/img/ios-icon.png";
import android_icon from "/assets/img/android-icon.png";
import features_bg from "/assets/img/features-bg.png";
import feature1 from "/assets/img/feature-mobile1.png";
import feature2 from "/assets/img/feature-mobile2.png";
import feature3 from "/assets/img/feature-mobile3.png";

const HomepageContent = ({ products, newProducts }) => {
  return (
    <div className="relative overflow-x-hidden -mt-16">
      <img
        src="/assets/img/bg1.svg"
        alt=""
        className="hidden md:block absolute -z-10 top-0 right-0 w-[72%] h-screen pointer-events-none object-cover object-left"
      />
      <Container className="px-4 md:px-12 pt-16">
        {newProducts?.slice(0, 1).map((item) => (
          <AdPopup key={item.id} data={item} />
        ))}

        {/* Hero */}
        <section className="relative">
          {/* Mobile hero — dark panel + floating drink image */}
          <div className="md:hidden">
            {/* Dark full section */}
            <div className="bg-neutral-950 px-6 pt-12 pb-14 flex flex-col gap-5">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em]">
                Coffee · Milktea · Choco · Ice Cream
              </span>
              <h2 className="text-[2.6rem] font-extrabold uppercase text-white leading-[1.1] tracking-tight">
                Start your
                <br />
                morning
                <br />
                with Uncle
                <br />
                Brew
              </h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-[280px]">
                Bold espressos, creamy lattes &amp; more — everything at ₱39!
              </p>
              <div className="flex gap-3 mt-1">
                <Link to="/menu">
                  <Button className="px-7 py-5 rounded-full bg-white text-black font-bold hover:bg-white/90 text-sm">
                    Order Now
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button
                    variant="outline"
                    className="px-7 py-5 rounded-full border-white/30 text-white bg-transparent hover:bg-white/10 text-sm"
                  >
                    View Menu
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop hero */}
          <div className="hidden md:grid md:grid-cols-2 min-h-[calc(100vh-4rem)] items-center py-16">
            <div className="flex flex-col items-start justify-start gap-4 animate-slide-in-left">
              <p className="px-6 py-1 rounded-full text-neutral-500 border border-gray-300">
                Coffee?
              </p>
              <h2 className="text-5xl font-bold tracking-wider uppercase text-black my-4">
                Start your <span className="block py-4">morning with</span>
                <span className="block py-4">Uncle Brew Coffee</span>
              </h2>
              <p className="text-base text-left text-neutral-500 my-4">
                Craving the perfect brew? Head over to Uncle Brew, where aroma
                meets passion! From bold espressos to creamy lattes, satisfy
                your senses with every sip. Don&apos;t wait — your next favorite
                cup is just a pour away!
              </p>
              <div className="my-4 flex gap-6">
                <Link to="/menu">
                  <Button className="px-16 py-6 rounded-full bg-hero hover:bg-black/80">
                    Order Now
                  </Button>
                </Link>
                <Link to="/">
                  <Button className="px-16 py-6 rounded-full" variant="outline">
                    Explore More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full relative h-[560px] flex items-center justify-center">
              <img
                src={food}
                alt="Hero"
                className="object-cover w-full h-full absolute mb-8 animate-slide-in"
                style={{ filter: "drop-shadow(30px 10px 50px gray)" }}
              />
            </div>
          </div>
        </section>

        {/* Popular */}
        <section className="flex flex-col gap-12 py-24">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={logo} alt="logo" className="w-48" />
            <h2 className="text-5xl font-bold">Popular Menu</h2>
            <p className="text-sm text-muted-foreground text-center">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis
              voluptate fuga pariatur
              <br /> inventore quidem nisi vitae, molestiae architecto corporis
              id!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 gap-y-20 md:gap-8 my-4 py-12">
            {products?.slice(0, 4).map((item) => (
              <PopularContent key={item.id} data={item} />
            ))}
          </div>
        </section>

        {/* Why Us */}
        <section className="py-24 flex flex-col items-center justify-center">
          <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-black my-4">
            Why Uncle Brew?
          </h2>
          <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
            At Uncle Brew, we don&apos;t just brew coffee, we craft moments.
            From the finest beans to the richest aromas, we ensure every cup is
            a celebration of flavor and comfort!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
            {[
              {
                icon: <CupSoda className="w-8 h-8 text-hero" />,
                title: "Serve Quality Coffee",
                desc: "Every cup is brewed with the finest, freshest beans to bring you an unforgettable experience that's rich in flavor and aroma.",
              },
              {
                icon: <FileHeart className="w-8 h-8 text-hero" />,
                title: "Best Quality",
                desc: "Craving coffee? We've got you covered! Our quick and reliable delivery service brings your favorite brew straight to your door, steaming hot and ready to savor.",
              },
              {
                icon: <Truck className="w-8 h-8 text-hero" />,
                title: "Fast Delivery",
                desc: "From bold brews to smooth blends, our menu is packed with options that cater to every coffee craving, preference, and mood!",
              },
            ].map(({ icon, title, desc }) => (
              <Card
                key={title}
                className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4"
              >
                {icon}
                <CardTitle className="text-neutral-600">{title}</CardTitle>
                <CardDescription className="text-center">
                  {desc}
                </CardDescription>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-4xl font-bold tracking-wider flex flex-col items-center text-black my-4">
            Effortless Ordering:{" "}
            <span className="text-neutral-500">A Quick Overview</span>
          </h2>
          <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
            -- How It Works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full my-2 mt-12">
            <div className="relative w-full min-h-[400px]">
              <img
                alt="chef"
                className="w-full h-full object-cover"
                src={uc_model}
                style={{ filter: "drop-shadow(0 -2mm 6mm rgb(0,0,0))" }}
              />
            </div>

            <div className="relative flex flex-col gap-12 items-center md:min-h-[520px]">
              {[
                { Icon: LogIn, label: "Sign Up" },
                { Icon: Circle, label: "Explore Coffee Menu" },
                { Icon: CreditCard, label: "Secure & Swift Checkout" },
                { Icon: Coffee, label: "Enjoy your Coffee" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-8 w-full">
                  <Icon
                    fill="black"
                    className="w-16 h-16 md:w-28 md:h-28 bg-black text-white p-4 md:p-7 rounded-full shrink-0"
                  />
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-neutral-900">
                      {label}
                    </h2>
                    <p className="text-base text-neutral-500 font-medium">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Earum recusandae provident possimus, modi labore
                      praesentium?
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>

      {/* Download App */}
      <section className="py-24 bg-black/10">
        <Container className="px-4 md:px-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex flex-col items-start gap-6 w-full lg:flex-1">
            <div className="flex flex-col items-start">
              <h2 className="text-4xl md:text-4xl font-bold tracking-wider text-neutral-500">
                Download <span className="text-black">Our Uncle</span>
              </h2>
              <h2 className="text-4xl md:text-4xl font-bold tracking-wider text-black">
                Brew App <span className="text-neutral-500">Today!</span>
              </h2>
            </div>
            <p className="text-base text-neutral-500 font-medium">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas
              tenetur itaque, libero enim eveniet praesentium!
            </p>
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {[
                ["5 Million+", "Worldwide Active Users"],
                ["150+", "Countries"],
                ["7500+", "Vendors"],
              ].map(([num, label], i) => (
                <div key={label} className="flex items-center gap-8">
                  {i > 0 && <hr className="h-14 w-[2px] bg-neutral-500" />}
                  <div>
                    <h2 className="text-3xl font-semibold">{num}</h2>
                    <p className="text-base text-neutral-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            {[
              {
                label: "iOS",
                sub: "iOS 18.2+",
                icon: ios_icon,
                iconAlt: "ios-icon",
              },
              {
                label: "Android",
                sub: "Android 12+",
                icon: android_icon,
                iconAlt: "android-icon",
              },
            ].map(({ label, sub, icon, iconAlt }) => (
              <Card
                key={label}
                className="overflow-hidden w-full sm:w-[280px] relative bg-gray-100 border-none p-4 rounded-xl gap-6 flex flex-col"
              >
                <div>
                  <h2 className="text-3xl font-bold">For {label}</h2>
                  <p className="text-base text-neutral-500">{sub}</p>
                </div>
                <Button className="rounded-full bg-black place-self-start">
                  Download App
                </Button>
                <div className="flex items-center justify-between gap-24">
                  <div className="bg-white p-3 rounded-md">
                    <img src={qr_code} alt="qr-code" className="w-16 h-16" />
                  </div>
                  <div className="bg-white p-6 rounded-full -right-6 -bottom-6 absolute">
                    <img src={icon} alt={iconAlt} className="w-16 h-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Container className="px-4 md:px-12">
        {/* Benefits */}
        <section className="py-24 flex flex-col items-center gap-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-3xl md:text-4xl font-bold tracking-wider text-black">
                Exclusive Benefits <span className="text-neutral-500">Of</span>
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wider text-neutral-500">
                Uncle Brew App
              </h2>
              <p className="w-full text-start text-base text-neutral-500 my-2">
                -- Benefits of Uncle Brew App{" "}
                <span className="text-black font-semibold">(Coming Soon!)</span>
              </p>
            </div>
            <p className="text-base text-neutral-500 border-l-[4px] border-black px-4 max-w-sm">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Perferendis fugit hic velit repellendus maiores odio officiis
              error provident tempore et.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[
              {
                icon: <Timer className="w-10 h-10" />,
                title: "Order Tracking",
              },
              {
                icon: <CreditCard className="w-10 h-10" />,
                title: "Secure Payments",
              },
              {
                icon: <Timer className="w-10 h-10" />,
                title: "Order Tracking",
              },
            ].map(({ icon, title }, i) => (
              <div key={i} className="flex flex-col items-start gap-4">
                <div className="bg-black rounded-lg text-white w-20 h-20 items-center justify-center flex">
                  {icon}
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
                <p className="text-base text-neutral-500 font-medium">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Earum recusandae provident possimus, modi labore praesentium?
                </p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      {/* Features */}
      <section className="overflow-hidden relative py-24">
        <div className="w-full h-full absolute inset-0">
          <img
            src={features_bg}
            alt="features-bg"
            className="w-full h-full object-cover"
          />
        </div>
        <Container className="px-4 md:px-12 relative flex flex-col gap-12 z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="flex flex-col items-start">
              <h2 className="text-3xl md:text-5xl font-bold tracking-wider text-white">
                Key Features <span className="text-white/70">Of</span>
              </h2>
              <h2 className="text-3xl md:text-5xl font-bold tracking-wider text-white/70">
                Uncle Brew App
              </h2>
            </div>
            <p className="text-base text-white border-l-[4px] border-white px-4 max-w-sm">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Perferendis fugit hic velit repellendus maiores odio officiis
              error provident tempore et.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            <Card className="flex flex-col items-center justify-center gap-2 py-6 px-8 border-none shadow-lg rounded-3xl">
              <h2 className="text-2xl font-semibold">Explore Nearby Cafe</h2>
              <p className="text-base text-neutral-500 text-center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                illum suscipit deleniti dolorum aut? Quam?
              </p>
              <div className="mt-4 w-full max-w-[300px] overflow-hidden bg-white">
                <img src={feature1} alt="feature1" className="w-full" />
              </div>
            </Card>

            <Card className="flex flex-col items-center justify-center gap-2 py-6 px-8 border-none shadow-lg rounded-3xl">
              <div className="w-full max-w-[300px] overflow-hidden bg-white mb-4">
                <img src={feature2} alt="feature2" className="w-full" />
              </div>
              <h2 className="text-2xl font-semibold">Track Your Order Live</h2>
              <p className="text-base text-neutral-500 text-center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                illum suscipit deleniti dolorum aut? Quam?
              </p>
            </Card>

            <Card className="flex flex-col items-center justify-center gap-2 py-6 px-8 border-none shadow-lg rounded-3xl sm:col-span-2 lg:col-span-1">
              <h2 className="text-2xl font-semibold">Live Chat and Call</h2>
              <p className="text-base text-neutral-500 text-center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                illum suscipit deleniti dolorum aut? Quam?
              </p>
              <div className="mt-4 w-full max-w-[300px] overflow-hidden bg-white">
                <img src={feature3} alt="feature3" className="w-full" />
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomepageContent;
