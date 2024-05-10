import {
    RxCrop,
    RxDesktop,
    RxPencil2,
    RxReader,
    RxRocket,
    RxAccessibility,
  } from "react-icons/rx";
  
// import SpaceCity1 from "../../assets/SpaceCity1.jpeg";
//   import SpaceCity5 from "../../assets/SpaceCity5.jpeg";
//   import SpaceCity6 from "../../assets/SpaceCity6.jpeg";
//   import SpaceCity7 from "../../assets/SpaceCity7.jpeg";
//   import SpaceCity8 from "../../assets/SpaceCity8.jpeg";
//   import SpaceCity9 from "../../assets/SpaceCity9.jpeg";
  
  import { getActivityTypes } from "../../utils/apiFunctions";
  
  export const TypesData = [
    {
      icon: RxCrop,
      title: "",
      content: "Lorem ipsum dolor sit /amet, consectetur adipiscing elit.",
      backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1715304359/images_etdb1h.jpg",
    },
    {
        icon: RxAccessibility,
        title: "",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1715304659/download_x5dazs.jpg",
      },
    {
      icon: RxPencil2,
      title: "",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1715304490/camel-india_sjln9m.jpg",
    },
    {
      icon: RxDesktop,
      title: "",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1715304524/artisan-workshop_gfhtpc.jpg",
    },
    {
      icon: RxReader,
      title: "",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1698838868/samples/food/fish-vegetables.jpg",
    },

    {
      icon: RxRocket,
      title: "",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1715304771/download_1_us47w9.jpg",
    },
    {
        icon: RxPencil2,
        title: "",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1715304921/images_1_fgucgs.jpg",
      },
      {
        icon: RxDesktop,
        title: "",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1698838877/samples/imagecon-group.jpg",
      },
      {
        icon: RxReader,
        title: "",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1698838872/samples/people/jazz.jpg",
      },
        {
            icon: RxAccessibility,
            title: "",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            backgroundImage: "https://res.cloudinary.com/do0rdj8oj/image/upload/v1698838874/samples/people/bicycle.jpg",
        }
  ];
  
  getActivityTypes().then((data) => {
    data.forEach((activity, index) => {
      TypesData[index].title = activity;
    });
  });
  console.log(TypesData);