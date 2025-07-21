/** @format */

export interface CMSPageContent {
  page_name: string;
  slug: string;
  identifier: string;
  page_content: JSON;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  createdAt: string;
  updatedAt: string;
}
export interface IHomePageContentType {
  page_content_english: HomePageCMSContent;
  page_content_arabic: HomePageCMSContent;
}
export interface HomePageCMSContent {
  mainSection?: {
    title: string;
    subTitle: string;
    headerLogo: string;
    backgroundImage: string;
    buttons: {
      title: string;
      link: string;
    }[];
  };
  counterSection?: {
    title: string;
    value: string;
  }[];
  facultySection?: {
    mainHeading: string;
    description: string;
    faculty: {
      name: string;
      image: string;
      altText: string;
      designation: string;
      link: string;
    }[];
  };
  educationSection?: {
    mainHeading: string;
    description: string;
    list: {
      title: string;
      image: string;
      altText: string;
      description: string;
    }[];
  };
  exploringSection?: {
    list: { image: string; title: string; altText: string; link: string }[];
    link: string;
    subHeading: string;
    description: string;
    mainHeading: string;
  };
  newsSection?: {
    description: string;
    mainHeading: string;
  };
  careerSection?: {
    description: string;
    mainHeading: string;
    link: string;
  };
  clientSection?: {
    mainHeading: string;
    image: string;
    altText: string;
    valueList: {
      rating: number;
      altText: string;
      image: string;
      fullName: string;
      designation: string;
      description: string;
    }[];
  };
}

export interface GlobalCMSContent {
  headerSection: HeaderContent;
  footerSection: FooterContent;
}
export interface IContactUsPageContentType {
  page_content_english: ContactUsInterface;
  page_content_arabic: ContactUsInterface;
}

export interface ContactUsInterface {
  mainSection?: {
    title: string;
    description: string;
    contactBGImage: string;
  };
  detailSection?: {
    secondTitle: string;
    value1: string;
    value2: string;
    value3: string;
    value4: string;
  };
  beginSection?: {
    mainTitle: string | null;
    image: string | null;
    valueList: {
      title: string | null;
      description: string;
    }[];
  };
  beginSubSection?: {
    mainTitle: string | null;
    description: string;
    buttonTitle: string | null;
  };
}

export interface PrivacyPolicyInterface {
  identifier: string;
  slug: string;
  page_name: string;
  page_content_english: {
    title: string;
    description: string;
  }[];
  page_content_arabic: {
    title: string;
    description: string;
  }[];
}
export interface AddPrivacyPolicyInterface {
  identifier: string;
  slug: string;
  page_name: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  page_content: {
    title: string;
    description: string;
    title_arabic: string;
    description_arabic: string;
  }[];
}

export interface AddAboutUsInterface {
  identifier: string;
  slug: string;
  page_name: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  page_content: {
    title: string;
    description: string;
    title_arabic: string;
    description_arabic: string;
  }[];
}
export interface ContactCmsInterface {
  identifier: string;
  slug: string;
  page_name: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  mainSection: {
    title: string;
    arabicTitle: string;
    description: string;
    arabicDescription: string;
    contactBGImage: string;
  };
  detailSection: {
    // value1: ReactI18NextChildren;
    secondTitle: string;
    secondArabicTitle: string;
    location: string;
    locationArabic: string;
    phone: string;
    phoneArabic: string;
    email: string;
    emailArabic: string;
    chatOption: string;
    chatOptionArabic: string;
  };
  beginSection: {
    mainTitle: string | null;
    mainTitleArabic: string | null;
    image: string | null;
    valueList: {
      title: string | null;
      titleArabic: string | null;
      description: string;
      descriptionArabic: string;
    }[];
  };
  beginSubSection: {
    mainSubTitle: string | null;
    mainSubTitleArabic: string | null;
    subDescription: string;
    subDescriptionArabic: string;
    buttonTitle: string | null;
    buttonTitleArabic: string | null;
  };
}
export interface HomeCMSInterface {
  identifier: string;
  slug: string;
  page_name: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  mainSection: {
    backgroundImage: string;
    headerLogo: string;
    title: string;
    title_arabic: string;
    subTitle: string;
    subTitle_arabic: string;
    buttons: {
      title: string;
      title_arabic: string;
      link: string;
      // link_arabic: string;
    }[];
  };
  counterSection: {
    title: string;
    title_arabic: string;
    value: string;
    value_arabic: string;
  }[];
  educationSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    list: {
      title: string;
      title_arabic: string;
      description: string;
      description_arabic: string;
      image: string;
      altText: string;
      altText_arabic: string;
    }[];
  };
  exploringSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    subHeading: string;
    subHeading_arabic: string;
    description: string;
    description_arabic: string;
    link: string;
    // link_arabic: string;
    list: {
      title: string;
      title_arabic: string;
      image: string;
      altText: string;
      altText_arabic: string;
      link: string;
      // link_arabic: string;
    }[];
  };
  facultySection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    faculty: {
      name: string;
      name_arabic: string;
      designation: string;
      designation_arabic: string;
      image: string;
      altText: string;
      altText_arabic: string;
      link: string;
      teacher: string | number;
      // link_arabic: string;
    }[];
  };
  newsSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
  };
  careerSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    link: string;
    // link_arabic: string;
  };
  clientSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    image: string;
    altText: string;
    altText_arabic: string;
    valueList: {
      altText: string;
      altText_arabic: string;
      rating: number;
      image: string;
      fullName: string;
      fullName_arabic: string;
      designation: string;
      designation_arabic: string;
      description: string;
      description_arabic: string;
    }[];
  };
}

export interface ContactUsFormInterface {
  fullName: string;
  email: string;
  phoneNumber: string;
  comment: string;
}
export interface TermsAndConditionInterface {
  identifier: string;
  slug: string;
  page_name: string;
  page_content_english: {
    title: string;
    description: string;
  }[];
  page_content_arabic: {
    title: string;
    description: string;
  }[];
}

export interface IGlobalPageContents {
  page_content_english: {
    headerSection: HeaderContent;
    footerSection: FooterContent;
  };
  page_content_arabic: {
    headerSection: HeaderContent;
    footerSection: FooterContent;
  };
}

export interface HeaderContent {
  logo: string;
  menuList: MenuList[];
}
export interface FooterContent {
  logo?: string;
  menuList?: {
    title: string;
    subMenuList?: {
      title: string;
      link: string;
    }[];
  }[];
  footerText?: string;
  footerLink?: {
    label: string;
    link: string;
  }[];
  socialLink?: { name: string; icon: string; link: string }[];
}

export interface MenuList {
  title?: string;
  link?: string;
  subMenuList?: {
    title: string;
    description: string;
    link: string;
  }[];
}

export interface IAboutUsCMSPageData {
  identifier: string;
  slug: string;
  page_name: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  mainSection: {
    bannerImage: string;
    title: string;
    title_arabic: string;
    description: string;
    description_arabic: string;
    altText: string;
    altText_arabic: string;
    list: {
      title: string;
      title_arabic: string;
    }[];
  };
  ourMissionSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    subHeading: string;
    subHeading_arabic: string;
    description: string;
    description_arabic: string;
  };

  counterSection: {
    leftBannerAltText: string;
    leftBannerAltText_arabic: string;
    rightBannerAltText: string;
    rightBannerAltText_arabic: string;
    leftBannerImage: string;
    rightBannerImage: string;
    list: {
      title: string;
      title_arabic: string;
      value: string;
      value_arabic: string;
    }[];
  };
  whoWeAreSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    altText: string;
    altText_arabic: string;
    image: string;
  };
  AcademicOfferingSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    image: string;
    altText: string;
    altText_arabic: string;
    link: string;
  };
  ACultureSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    image: string;
    altText: string;
    altText_arabic: string;
    link: string;
  };
  communitiesSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    list: {
      title: string;
      title_arabic: string;
      description: string;
      description_arabic: string;
      image: string;
      altText: string;
      altText_arabic: string;
      link: string;
    }[];
  };
  peopleCommittedSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
    link: string;
    list: {
      link: string;
      teacher: string;
      altText: string;
      altText_arabic: string;
      image: string;
      name: string;
      name_arabic: string;
      designation: string;
      designation_arabic: string;
    }[];
  };

  fundedSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    link: string;
    altText: string;
    altText_arabic: string;
    image: string;
  };
  newsSection: {
    mainHeading: string;
    mainHeading_arabic: string;
    description: string;
    description_arabic: string;
  };
}
export interface IAboutPageContents {
  page_content_english: AboutPageCMSContent;
  page_content_arabic: AboutPageCMSContent;
}
export interface AboutPageCMSContent {
  mainSection?: {
    title: string;
    description: string;
    bannerImage: string;
    altText: string;
    list: {
      title: string;
    }[];
  };
  ourMissionSection?: {
    mainHeading: string;
    subHeading: string;
    description: string;
  };
  counterSection?: {
    leftBannerImage: string;
    leftBannerAltText: string;
    rightBannerImage: string;
    rightBannerAltText: string;
    list: {
      title: string;
      value: string;
    }[];
  };
  whoWeAreSection?: {
    mainHeading: string;
    description: string;
    image: string;
    altText: string;
  };
  AcademicOfferingSection?: {
    mainHeading: string;
    description: string;
    image: string;
    altText: string;
    link: string;
  };
  ACultureSection?: {
    mainHeading: string;
    description: string;
    image: string;
    altText: string;
    link: string;
  };
  communitiesSection?: {
    mainHeading: string;
    list: {
      title: string;
      description: string;
      image: string;
      altText: string;
      link: string;
    }[];
  };
  peopleCommittedSection?: {
    mainHeading: string;
    description: string;
    link: string;
    list: {
      name: string;
      designation: string;
      image: string;
      altText: string;
      link: string;
    }[];
  };
  fundedSection?: {
    mainHeading: string;
    description: string;
    image: string;
    altText: string;
    link: string;
  };
  newsSection?: {
    mainHeading: string;
    description: string;
  };
}
