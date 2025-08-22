export const uiResources = {
  en: {
    // Backend namespaces (aligned with server)
    common: {
      success: 'Success',
      error: 'Error',
      statusSuccess: 'success',
      statusError: 'error',
      welcome: 'Welcome',
      loading: 'Loading...',
      notFound: 'Not found',
      unauthorized: 'Unauthorized access',
      forbidden: 'Access forbidden',
      internalError: 'Internal server error',
      badRequest: 'Bad request',
      created: 'Created successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      operationFailed: 'Operation failed',
      invalidRequest: 'Invalid request',
      resourceNotFound: 'Resource not found',
      serverError: 'Server error occurred',
      maintenance: 'Server is under maintenance',
      rateLimited: 'Too many requests. Please try again later.',
      timeout: 'Request timeout',
      dataRetrieved: 'Data retrieved successfully',
      languageUpdated: 'Language updated successfully',
      languageReset: 'Language reset to default successfully'
    },
    events: {
      heading: 'Events & Catering',
      desc: 'We organize special events and catering for large groups. From birthdays to corporate events.',
      plan: 'Plan Event',
      catering: 'Catering Service',
      q1: {
        question: 'What is the minimum group size for events?',
        answer: 'Our minimum group size for events is 20 people. For smaller groups, we recommend regular reservations.'
      },
      q2: {
        question: 'Do you offer vegetarian and vegan options?',
        answer: 'Yes, we have a complete menu of vegetarian and vegan options. We can also customize menus according to your dietary needs.'
      }
    },
    faq: {
      heading: 'Frequently Asked Questions',
      q1: {
        question: 'What is your delivery time?',
        answer: 'Our average delivery time is 25-35 minutes. We use real-time tracking so you can see exactly when your order will arrive.'
      },
      q2: {
        question: 'Do you offer vegetarian and vegan options?',
        answer: 'Yes! We have a wide selection of vegetarian and vegan dishes. Our menu includes plant-based tacos, bowls, and sides.'
      },
      q3: {
        question: 'Can I customize my order?',
        answer: 'Absolutely! You can customize any dish by adding or removing ingredients. Just let us know your preferences when ordering.'
      }
    },
    popular: {
      heading: 'Popular This Week',
      seeMenu: 'See Full Menu',
      coming: 'Coming Soon',
      chefSpecial: 'Chef Special {{num}}',
      notify: 'Notify Me',
      rating: '4.9/5 from 2,400+ locals'
    },
    auth: {
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      logoutSuccess: 'Logout successful',
      registerSuccess: 'Registration successful',
      registerFailed: 'Registration failed',
      invalidCredentials: 'Invalid credentials',
      accountLocked: 'Account is locked',
      accountNotVerified: 'Account is not verified',
      passwordResetSent: 'Password reset link sent to your email',
      passwordResetSuccess: 'Password reset successful',
      passwordResetFailed: 'Password reset failed',
      tokenExpired: 'Token has expired',
      tokenInvalid: 'Invalid token',
      accessDenied: 'Access denied',
      sessionExpired: 'Session has expired',
      emailAlreadyExists: 'Email already exists',
      usernameAlreadyExists: 'Username already exists',
      accountCreated: 'Account created successfully',
      verificationEmailSent: 'Verification email sent',
      emailVerified: 'Email verified successfully',
      invalidVerificationToken: 'Invalid verification token'
    },
    api: {
      dataRetrieved: 'Data retrieved successfully',
      dataUpdated: 'Data updated successfully',
      dataCreated: 'Data created successfully',
      dataDeleted: 'Data deleted successfully',
      noDataFound: 'No data found',
      invalidApiKey: 'Invalid API key',
      apiKeyExpired: 'API key has expired',
      apiKeyRequired: 'API key is required',
      quotaExceeded: 'API quota exceeded',
      methodNotAllowed: 'Method not allowed',
      unsupportedMediaType: 'Unsupported media type',
      payloadTooLarge: 'Payload too large',
      requestEntityTooLarge: 'Request entity too large',
      contentTypeRequired: 'Content-Type header is required',
      jsonParseError: 'Invalid JSON format',
      missingRequiredField: 'Missing required field: {{field}}',
      invalidFieldValue: 'Invalid value for field: {{field}}',
      duplicateEntry: 'Duplicate entry found',
      constraintViolation: 'Database constraint violation',
      connectionError: 'Database connection error',
      checkApiDocsAction: 'Check the URL or refer to the API documentation for valid endpoints.'
    },
    validation: {
      required: '{{field}} is required',
      email: 'Please enter a valid email address',
      minLength: '{{field}} must be at least {{min}} characters long',
      maxLength: '{{field}} must not exceed {{max}} characters',
      passwordStrength: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
      passwordMatch: 'Passwords do not match',
      invalidFormat: 'Invalid format for {{field}}',
      invalidDate: 'Invalid date format',
      futureDateRequired: 'Date must be in the future',
      pastDateRequired: 'Date must be in the past',
      invalidPhone: 'Invalid phone number format',
      invalidUrl: 'Invalid URL format',
      numericOnly: '{{field}} must contain only numbers',
      alphabeticOnly: '{{field}} must contain only letters',
      alphanumericOnly: '{{field}} must contain only letters and numbers',
      invalidRange: '{{field}} must be between {{min}} and {{max}}',
      fileRequired: 'File is required',
      invalidFileType: 'Invalid file type. Allowed types: {{types}}',
      fileSizeExceeded: 'File size must not exceed {{maxSize}}',
      invalidImageFormat: 'Invalid image format',
      duplicateValue: '{{field}} already exists'
    },
    email: {
      subject: {
        welcome: 'Welcome to {{appName}}',
        passwordReset: 'Password Reset Request',
        emailVerification: 'Verify Your Email Address',
        accountLocked: 'Account Security Alert',
        loginAlert: 'New Login Detected'
      },
      greeting: 'Hello {{name}},',
      welcomeMessage: 'Welcome to {{appName}}! We are excited to have you with us.',
      passwordResetMessage: 'You have requested a password reset. Click the link below to proceed:',
      verificationMessage: 'Please verify your email address by clicking the link below:',
      accountLockedMessage: 'Your account has been temporarily locked due to multiple failed login attempts.',
      loginAlertMessage: 'We have detected a new login to your account from {{location}} at {{time}}.',
      footer: 'If you did not request this, please ignore this email or contact support.',
      buttonText: {
        resetPassword: 'Reset Password',
        verifyEmail: 'Verify Email',
        contactSupport: 'Contact Support'
      },
      expiryNotice: 'This link will expire in {{hours}} hours.',
      supportContact: 'If you need help, please contact us at {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Menu item created successfully',
        itemUpdated: 'Menu item updated successfully',
        itemDeleted: 'Menu item deleted successfully',
        itemNotFound: 'Menu item not found',
        categoryCreated: 'Menu category created successfully',
        categoryUpdated: 'Menu category updated successfully',
        categoryDeleted: 'Menu category deleted successfully',
        categoryNotFound: 'Menu category not found',
        itemOutOfStock: 'Menu item is out of stock',
        invalidPrice: 'Invalid price specified',
        duplicateItem: 'Menu item already exists'
      },
      orders: {
        orderCreated: 'Order created successfully',
        orderUpdated: 'Order updated successfully',
        orderCancelled: 'Order cancelled successfully',
        orderNotFound: 'Order not found',
        orderStatusUpdated: 'Order status updated successfully',
        invalidOrderStatus: 'Invalid order status',
        orderAlreadyCancelled: 'Order is already cancelled',
        orderCannotBeCancelled: 'Order cannot be cancelled at this stage',
        paymentRequired: 'Payment is required to complete the order',
        insufficientInventory: 'Insufficient inventory for some items',
        orderTotal: 'Order total: {{amount}}',
        estimatedDelivery: 'Estimated delivery time: {{time}} minutes'
      },
      reservations: {
        reservationCreated: 'Reservation created successfully',
        reservationUpdated: 'Reservation updated successfully',
        reservationCancelled: 'Reservation cancelled successfully',
        reservationNotFound: 'Reservation not found',
        reservationConfirmed: 'Reservation confirmed',
        tableNotAvailable: 'Table is not available at the requested time',
        invalidReservationTime: 'Invalid reservation time',
        reservationTooEarly: 'Reservation time is too far in the future',
        reservationTooLate: 'Reservation time has already passed',
        capacityExceeded: 'Group size exceeds table capacity'
      }
    },
    home: {
      hero: {
        badge: 'New: Rewards launch — earn points on every order',
        title: 'Authentic Mexican. <primary>Delivered fast.</primary>',
        desc: 'From street‑style tacos to slow‑cooked specialties. Order in seconds, reserve a table instantly, and track your delivery in real time — all in one place.',
        orderNow: 'Order Now',
        reserve: 'Reserve a Table',
        browseMenu: 'Browse full menu',
        rating: '4.9/5 from 2,400+ local diners',
        avgTime: 'Delivery under 35 minutes on average',
        openNow: 'Open now',
        closedNow: 'Closed now',
        eta: 'ETA ~ {{m}}m',
        card: {
          title: "Chef's Pick",
          desc: 'Slow-braised barbacoa with fresh salsa verde and warm tortillas.'
        }
      },
      logo: {
        heading: 'Trusted by local foodies and featured in'
      },
      explore: {
        heading: 'Explore the menu',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Drinks',
        coming: 'Coming soon.',
        chefNotes: 'Chef notes: crowd favorite with fresh cilantro and lime.',
        viewMore: 'View more'
      },
      loyalty: {
        heading: 'Loyalty & rewards',
        membersSave: 'Members save more',
        points: 'points',
        nextAt: 'Next reward at {{points}}',
        freeDessert: 'Free dessert',
        join: 'Join rewards',
        perks: 'View perks'
      },
      why: {
        heading: 'Why choose Cantina',
        faster: { title: 'Faster than apps', desc: 'Direct kitchen to doorstep, no third‑party delays.' },
        fees: { title: 'Transparent fees', desc: 'No surprise charges at checkout.' },
        oneTap: { title: 'One‑tap reservations', desc: 'Live availability and SMS confirmations.' },
        tracking: { title: 'Live tracking', desc: 'Minute‑by‑minute delivery updates.' },
        chef: { title: 'Chef‑crafted', desc: 'Fresh ingredients and seasonal menus.' },
        rewards: { title: 'Rewards that matter', desc: 'Points on every order, instant perks.' }
      },
      faq: {
        heading: 'Frequently asked questions',
        q1: {
          question: 'What is your delivery time?',
          answer: 'Our average delivery time is 25-35 minutes. We use real-time tracking so you can see exactly when your order will arrive.'
        },
        q2: {
          question: 'Do you offer vegetarian and vegan options?',
          answer: 'Yes! We have a wide selection of vegetarian and vegan dishes. Our menu includes plant-based tacos, bowls, and sides.'
        },
        q3: {
          question: 'Can I customize my order?',
          answer: 'Absolutely! You can customize any dish by adding or removing ingredients. Just let us know your preferences when ordering.'
        }
      },
      popular: {
        heading: 'Popular This Week',
        seeMenu: 'See Full Menu',
        coming: 'Coming Soon',
        chefSpecial: 'Chef Special {{num}}',
        notify: 'Notify Me',
        rating: '4.9/5 from 2,400+ locals'
      },
      cta: {
        title: 'Ready to experience authentic Mexican?',
        desc: 'Join thousands of satisfied customers who choose Cantina for quality, speed, and service.',
        socialProof: '2,400+ happy customers this month',
        limited: 'Limited time offer',
        start: 'Start Ordering',
        reserve: 'Reserve Table',
        endsTonight: 'Ends tonight at midnight'
      },
      offers: {
        heading: 'Seasonal offers',
        badge: 'Limited time',
        bundle: 'Taco Tuesday Bundle',
        deal: '2 tacos + drink — $9.99',
        endsIn: 'Ends in',
        orderBundle: 'Order bundle',
        viewDetails: 'View details'
      },
      seo: {
        title: 'Cantina Mariachi – Authentic Mexican, Modern Experience',
        description: 'Order online in seconds, reserve instantly, and track your delivery live. Authentic Mexican cuisine delivered fast.',
        keywords: 'Mexican food, tacos, delivery, restaurant, online ordering, table reservation'
      },
      values: {
        heading: 'Our Values & Sourcing',
        desc: 'We\'re committed to quality, sustainability, and supporting local communities through responsible sourcing and eco-friendly practices.',
        badges: {
          localProduce: 'Local Produce',
          sustainableSeafood: 'Sustainable Seafood',
          fairTrade: 'Fair Trade',
          lowWaste: 'Low Waste'
        },
        cards: {
          dailyMarket: 'Daily Market Fresh',
          houseSalsas: 'House-Made Salsas',
          localTortillas: 'Local Tortillas',
          compostablePackaging: 'Compostable Packaging'
        }
      },
      value: {
        reorderDesc: 'Reorder your favorites in seconds',
        trustedTitle: 'Trusted by 10,000+ locals',
        trustedDesc: 'Join thousands of satisfied customers'
      },
      how: {
        heading: 'How It Works',
        desc: 'Ordering with Cantina Mariachi is simple and fast',
        step1: {
          title: 'Choose Your Favorites',
          desc: 'Browse our menu and select your favorite dishes'
        },
        step2: {
          title: 'Place Your Order',
          desc: 'Customize your order and checkout securely'
        },
        step3: {
          title: 'Track & Enjoy',
          desc: 'Follow your order in real-time and enjoy fresh food'
        }
      },
      testimonials: {
        heading: 'What Our Customers Say'
      },
      sticky: {
        order: 'Order Now'
      }
    },
    events: {
      heading: 'Events & Catering',
      desc: 'We organize special events and catering services for large groups. From birthdays to corporate events.',
      plan: 'Plan Event',
      catering: 'Catering Service',
      q1: {
        question: 'What is the minimum group size for events?',
        answer: 'Our minimum group size for events is 20 people. For smaller groups, we recommend regular reservations.'
      },
      q2: {
        question: 'Do you offer vegetarian and vegan options?',
        answer: 'Yes, we have a complete menu of vegetarian and vegan options. We can also customize menus according to your dietary needs.'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        orders: 'Orders',
        reservations: 'Reservations',
        account: 'Account',
        profile: 'Profile',
        login: 'Login',
        register: 'Register',
        orderNow: 'Order Now',
      },
      offer: {
        freeDelivery: 'Today only: free delivery on orders over $25',
      },
      topbar: {
        open: 'Open now',
        closed: 'Closed now',
        eta: 'ETA ~ {{mins}}m',
        noSignup: 'No sign-up needed',
        browse: 'Browse menu',
      },
      brand: 'Cantina',
      errors: {
        title: 'Oops!',
        notFound: 'The requested page could not be found.',
      },
      a11y: {
        toggleLanguage: 'Toggle language',
        toggleTheme: 'Toggle theme',
        close: 'Close'
      },
      language: {
        reset: 'Reset to Default',
        select: 'Select Language',
        current: 'Current Language'
      },
      theme: {
        toggle: 'Toggle theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      footer: {
        tagline: 'Authentic Mexican flavors, modern experience.',
        quickLinks: 'Quick Links',
        contact: 'Contact',
        newsletter: 'Get 20% off your first order + exclusive deals 📧',
        emailPlaceholder: 'Email address',
        join: 'Join',
        privacy: 'Privacy',
        terms: 'Terms',
        copyright: '© {{year}} {{brand}}. All rights reserved.'
      }
    },
    menu: {
      hero: {
        title: 'Explore our menu',
        subtitle: 'Chef‑crafted dishes, fresh ingredients, and seasonal specials.'
      },
      actions: {
        searchPlaceholder: 'Search dishes…',
        search: 'Search',
        sortBy: 'Sort by',
        sort: {
          popular: 'Most popular',
          priceLow: 'Price: low to high',
          priceHigh: 'Price: high to low',
          newest: 'Newest'
        },
        add: 'Add to Order',
        unavailable: 'Unavailable',
        noItems: 'No items found.'
      },
      categories: 'Categories',
      categoriesAll: 'All',
      filters: {
        dietary: 'Dietary',
        vegetarian: 'Vegetarian',
        vegan: 'Vegan',
        glutenFree: 'Gluten‑free',
        spicy: 'Spicy'
      },
      results: 'Showing {{count}} items',
      badges: { new: 'New', popular: 'Popular' }
    },
    orders: {
      title: 'My Orders',
      nav: { mine: 'My Orders', track: 'Track' },
      table: { order: 'Order #', status: 'Status', total: 'Total', date: 'Date', actions: 'Actions' },
      empty: 'No orders yet.',
      create: 'Create order',
      trackTitle: 'Track Order',
      trackDesc: 'Enter your order number and tracking code.',
      trackForm: {
        orderNumber: 'Order number',
        trackingCode: 'Tracking code',
        placeholderOrder: 'e.g. 12345',
        placeholderTracking: 'e.g. ABCD-7890',
        submit: 'Check status'
      },
      detailTitle: 'Order #{{orderNumber}}',
      statuses: { pending: 'Pending', preparing: 'Preparing', delivering: 'Delivering', completed: 'Completed', cancelled: 'Cancelled' }
    },
    reservations: {
      hero: {
        title: 'Book a Table',
        subtitle: 'Book a table at our restaurant and enjoy an authentic Mexican dining experience',
        date: 'Date',
        time: 'Time',
        partySize: 'Party Size',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        notes: 'Special Notes',
        bookNow: 'Book Now',
        available: 'Available',
        unavailable: 'Unavailable',
        selectDate: 'Select Date',
        selectTime: 'Select Time',
        selectPartySize: 'Select Party Size'
      },
      form: {
        required: 'Required',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid phone number',
        minPartySize: 'Minimum: 1 person',
        maxPartySize: 'Maximum: 20 people',
        submit: 'Submit Reservation',
        submitting: 'Submitting...',
        success: 'Reservation successful!',
        error: 'Error making reservation'
      },
      availability: {
        title: 'Available Times',
        today: 'Today',
        tomorrow: 'Tomorrow',
        thisWeek: 'This Week',
        nextWeek: 'Next Week',
        noAvailability: 'No times available',
        loading: 'Loading...'
      },
      confirmation: {
        title: 'Reservation Confirmation',
        message: 'A confirmation will be sent to your email',
        reference: 'Reference Number',
        date: 'Date',
        time: 'Time',
        partySize: 'Party Size',
        location: 'Location',
        contact: 'Contact Information'
      }
    },
    account: {
      hero: {
        title: 'My Account',
        subtitle: 'Manage your personal information, orders, and reservations',
        welcome: 'Hello, {{name}}'
      },
      profile: {
        title: 'Profile',
        personalInfo: 'Personal Information',
        contactInfo: 'Contact Information',
        preferences: 'Preferences',
        save: 'Save Changes',
        saved: 'Saved',
        saving: 'Saving...'
      },
      orders: {
        title: 'My Orders',
        recent: 'Recent Orders',
        all: 'All Orders',
        status: 'Status',
        date: 'Date',
        total: 'Total',
        viewDetails: 'View Details',
        reorder: 'Reorder',
        track: 'Track Order',
        noOrders: 'No orders yet'
      },
      reservations: {
        title: 'My Reservations',
        upcoming: 'Upcoming Reservations',
        past: 'Past Reservations',
        cancel: 'Cancel Reservation',
        modify: 'Modify Reservation',
        noReservations: 'No reservations'
      },
      settings: {
        title: 'Settings',
        notifications: 'Notifications',
        language: 'Language',
        currency: 'Currency',
        timezone: 'Timezone',
        privacy: 'Privacy',
        security: 'Security'
      },
      logout: 'Logout',
      deleteAccount: 'Delete Account'
    }
  },
  
  // Arabic translations
  ar: {
    common: {
      success: 'نجح',
      error: 'خطأ',
      statusSuccess: 'نجح',
      statusError: 'خطأ',
      welcome: 'مرحباً',
      loading: 'جاري التحميل...',
      notFound: 'غير موجود',
      unauthorized: 'وصول غير مصرح',
      forbidden: 'وصول محظور',
      internalError: 'خطأ داخلي في الخادم',
      badRequest: 'طلب خاطئ',
      created: 'تم الإنشاء بنجاح',
      updated: 'تم التحديث بنجاح',
      deleted: 'تم الحذف بنجاح',
      operationFailed: 'فشلت العملية',
      invalidRequest: 'طلب غير صحيح',
      resourceNotFound: 'المورد غير موجود',
      serverError: 'حدث خطأ في الخادم',
      maintenance: 'الخادم في الصيانة',
      rateLimited: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً.',
      timeout: 'انتهت مهلة الطلب',
      dataRetrieved: 'تم استرجاع البيانات بنجاح',
      languageUpdated: 'تم تحديث اللغة بنجاح',
      languageReset: 'تم إعادة تعيين اللغة إلى الافتراضي بنجاح'
    },
    events: {
      heading: 'الفعاليات والضيافة',
      desc: 'ننظم فعاليات خاصة وخدمات ضيافة للمجموعات الكبيرة. من أعياد الميلاد إلى الفعاليات المؤسسية.',
      plan: 'تخطيط الفعالية',
      catering: 'خدمة الضيافة',
      q1: {
        question: 'ما هو الحد الأدنى لحجم المجموعة للفعاليات؟',
        answer: 'الحد الأدنى لحجم المجموعة للفعاليات هو 20 شخصاً. للمجموعات الأصغر، نوصي بالحجوزات العادية.'
      },
      q2: {
        question: 'هل تقدمون خيارات نباتية ونباتية صرفة؟',
        answer: 'نعم، لدينا قائمة كاملة من الخيارات النباتية والنباتية الصرفة. يمكننا أيضاً تخصيص القوائم حسب احتياجاتكم الغذائية.'
      }
    },
    faq: {
      heading: 'الأسئلة الشائعة',
      q1: {
        question: 'ما هو وقت التوصيل؟',
        answer: 'متوسط وقت التوصيل لدينا هو 25-35 دقيقة. نستخدم التتبع في الوقت الفعلي حتى تتمكن من رؤية موعد وصول طلبك بالضبط.'
      },
      q2: {
        question: 'هل تقدمون خيارات نباتية ونباتية صرفة؟',
        answer: 'نعم! لدينا مجموعة واسعة من الأطباق النباتية والنباتية الصرفة. قائمتنا تشمل التاكو النباتي والسلطات والأطباق الجانبية.'
      },
      q3: {
        question: 'هل يمكنني تخصيص طلبي؟',
        answer: 'بالتأكيد! يمكنك تخصيص أي طبق بإضافة أو إزالة المكونات. فقط أخبرنا بتفضيلاتك عند الطلب.'
      }
    },
    popular: {
      heading: 'الأكثر شعبية هذا الأسبوع',
      seeMenu: 'انظر القائمة الكاملة',
      coming: 'قريباً',
      chefSpecial: 'طبق الشيف الخاص {{num}}',
      notify: 'أخبرني',
      rating: '4.9/5 من أكثر من 2,400 من السكان المحليين'
    },
    auth: {
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      loginFailed: 'فشل تسجيل الدخول',
      logoutSuccess: 'تم تسجيل الخروج بنجاح',
      registerSuccess: 'تم التسجيل بنجاح',
      registerFailed: 'فشل التسجيل',
      invalidCredentials: 'بيانات اعتماد غير صحيحة',
      accountLocked: 'الحساب مقفل',
      accountNotVerified: 'الحساب غير مُتحقق منه',
      passwordResetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      passwordResetSuccess: 'تم إعادة تعيين كلمة المرور بنجاح',
      passwordResetFailed: 'فشلت إعادة تعيين كلمة المرور',
      tokenExpired: 'انتهت صلاحية الرمز المميز',
      tokenInvalid: 'رمز مميز غير صحيح',
      accessDenied: 'تم رفض الوصول',
      sessionExpired: 'انتهت صلاحية الجلسة',
      emailAlreadyExists: 'البريد الإلكتروني موجود بالفعل',
      usernameAlreadyExists: 'اسم المستخدم موجود بالفعل',
      accountCreated: 'تم إنشاء الحساب بنجاح',
      verificationEmailSent: 'تم إرسال بريد إلكتروني للتحقق',
      emailVerified: 'تم التحقق من البريد الإلكتروني بنجاح',
      invalidVerificationToken: 'رمز التحقق غير صحيح'
    },
    api: {
      dataRetrieved: 'تم استرجاع البيانات بنجاح',
      dataUpdated: 'تم تحديث البيانات بنجاح',
      dataCreated: 'تم إنشاء البيانات بنجاح',
      dataDeleted: 'تم حذف البيانات بنجاح',
      noDataFound: 'لم يتم العثور على بيانات',
      invalidApiKey: 'مفتاح API غير صحيح',
      apiKeyExpired: 'انتهت صلاحية مفتاح API',
      apiKeyRequired: 'مفتاح API مطلوب',
      quotaExceeded: 'تم تجاوز حصة API',
      methodNotAllowed: 'الطريقة غير مسموح بها',
      unsupportedMediaType: 'نوع الوسائط غير مدعوم',
      payloadTooLarge: 'الحمولة كبيرة جداً',
      requestEntityTooLarge: 'كيان الطلب كبير جداً',
      contentTypeRequired: 'رأس Content-Type مطلوب',
      jsonParseError: 'تنسيق JSON غير صحيح',
      missingRequiredField: 'الحقل المطلوب مفقود: {{field}}',
      invalidFieldValue: 'قيمة غير صحيحة للحقل: {{field}}',
      duplicateEntry: 'تم العثور على إدخال مكرر',
      constraintViolation: 'انتهاك قيود قاعدة البيانات',
      connectionError: 'خطأ في الاتصال بقاعدة البيانات',
      checkApiDocsAction: 'تحقق من الرابط أو راجع وثائق API للحصول على نقاط نهاية صالحة.'
    },
    validation: {
      required: '{{field}} مطلوب',
      email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      minLength: 'يجب أن يكون {{field}} بطول {{min}} أحرف على الأقل',
      maxLength: 'يجب ألا يتجاوز {{field}} {{max}} حرف',
      passwordStrength: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وحرف كبير واحد، وحرف صغير واحد، ورقم واحد',
      passwordMatch: 'كلمات المرور غير متطابقة',
      invalidFormat: 'تنسيق غير صحيح لـ {{field}}',
      invalidDate: 'تنسيق تاريخ غير صحيح',
      futureDateRequired: 'يجب أن يكون التاريخ في المستقبل',
      pastDateRequired: 'يجب أن يكون التاريخ في الماضي',
      invalidPhone: 'تنسيق رقم هاتف غير صحيح',
      invalidUrl: 'تنسيق URL غير صحيح',
      numericOnly: 'يجب أن يحتوي {{field}} على أرقام فقط',
      alphabeticOnly: 'يجب أن يحتوي {{field}} على أحرف فقط',
      alphanumericOnly: 'يجب أن يحتوي {{field}} على أحرف وأرقام فقط',
      invalidRange: 'يجب أن يكون {{field}} بين {{min}} و {{max}}',
      fileRequired: 'الملف مطلوب',
      invalidFileType: 'نوع ملف غير صحيح. الأنواع المسموحة: {{types}}',
      fileSizeExceeded: 'يجب ألا يتجاوز حجم الملف {{maxSize}}',
      invalidImageFormat: 'تنسيق صورة غير صحيح',
      duplicateValue: '{{field}} موجود بالفعل'
    },
    email: {
      subject: {
        welcome: 'مرحباً بك في {{appName}}',
        passwordReset: 'طلب إعادة تعيين كلمة المرور',
        emailVerification: 'تحقق من عنوان بريدك الإلكتروني',
        accountLocked: 'تنبيه أمان الحساب',
        loginAlert: 'تم اكتشاف تسجيل دخول جديد'
      },
      greeting: 'مرحباً {{name}}،',
      welcomeMessage: 'مرحباً بك في {{appName}}! نحن متحمسون لوجودك معنا.',
      passwordResetMessage: 'لقد طلبت إعادة تعيين كلمة المرور. انقر على الرابط أدناه للمتابعة:',
      verificationMessage: 'يرجى التحقق من عنوان بريدك الإلكتروني بالنقر على الرابط أدناه:',
      accountLockedMessage: 'تم قفل حسابك مؤقتاً بسبب محاولات تسجيل دخول فاشلة متعددة.',
      loginAlertMessage: 'لقد اكتشفنا تسجيل دخول جديد إلى حسابك من {{location}} في {{time}}.',
      footer: 'إذا لم تطلب هذا، يرجى تجاهل هذا البريد الإلكتروني أو الاتصال بالدعم.',
      buttonText: {
        resetPassword: 'إعادة تعيين كلمة المرور',
        verifyEmail: 'التحقق من البريد الإلكتروني',
        contactSupport: 'الاتصال بالدعم'
      },
      expiryNotice: 'سينتهي هذا الرابط في {{hours}} ساعة.',
      supportContact: 'إذا كنت بحاجة إلى مساعدة، يرجى الاتصال بنا على {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'تم إنشاء عنصر القائمة بنجاح',
        itemUpdated: 'تم تحديث عنصر القائمة بنجاح',
        itemDeleted: 'تم حذف عنصر القائمة بنجاح',
        itemNotFound: 'عنصر القائمة غير موجود',
        categoryCreated: 'تم إنشاء فئة القائمة بنجاح',
        categoryUpdated: 'تم تحديث فئة القائمة بنجاح',
        categoryDeleted: 'تم حذف فئة القائمة بنجاح',
        categoryNotFound: 'فئة القائمة غير موجودة',
        itemOutOfStock: 'عنصر القائمة نفد من المخزون',
        invalidPrice: 'سعر غير صحيح محدد',
        duplicateItem: 'عنصر القائمة موجود بالفعل'
      },
      orders: {
        orderCreated: 'تم إنشاء الطلب بنجاح',
        orderUpdated: 'تم تحديث الطلب بنجاح',
        orderCancelled: 'تم إلغاء الطلب بنجاح',
        orderNotFound: 'الطلب غير موجود',
        orderStatusUpdated: 'تم تحديث حالة الطلب بنجاح',
        invalidOrderStatus: 'حالة طلب غير صحيحة',
        orderAlreadyCancelled: 'الطلب ملغي بالفعل',
        orderCannotBeCancelled: 'لا يمكن إلغاء الطلب في هذه المرحلة',
        paymentRequired: 'الدفع مطلوب لإكمال الطلب',
        insufficientInventory: 'مخزون غير كافٍ لبعض العناصر',
        orderTotal: 'إجمالي الطلب: {{amount}}',
        estimatedDelivery: 'وقت التوصيل المقدر: {{time}} دقيقة'
      },
      reservations: {
        reservationCreated: 'تم إنشاء الحجز بنجاح',
        reservationUpdated: 'تم تحديث الحجز بنجاح',
        reservationCancelled: 'تم إلغاء الحجز بنجاح',
        reservationNotFound: 'الحجز غير موجود',
        reservationConfirmed: 'تم تأكيد الحجز',
        tableNotAvailable: 'الطاولة غير متاحة في الوقت المطلوب',
        invalidReservationTime: 'وقت حجز غير صحيح',
        reservationTooEarly: 'وقت الحجز بعيد جداً في المستقبل',
        reservationTooLate: 'وقت الحجز قد مر بالفعل',
        capacityExceeded: 'حجم المجموعة يتجاوز سعة الطاولة'
      }
    },
    home: {
      hero: {
        badge: 'جديد: إطلاق المكافآت — اكسب نقاطاً مع كل طلب',
        title: 'مأكولات مكسيكية أصيلة. <primary>توصيل سريع.</primary>',
        desc: 'من أطباق الشارع إلى الوصفات المطهوة ببطء. اطلب خلال ثوانٍ، احجز فوراً، وتابع التوصيل مباشرة — كل ذلك في مكان واحد.',
        orderNow: 'اطلب الآن',
        reserve: 'احجز طاولة',
        browseMenu: 'تصفح القائمة كاملة',
        rating: '4.9/5 من أكثر من 2400 زبون محلي',
        avgTime: 'التوصيل في أقل من 35 دقيقة في المتوسط',
        openNow: 'مفتوح الآن',
        closedNow: 'مغلق الآن',
        eta: 'الوصول المتوقع ~ {{m}} د',
        card: {
          title: 'اختيار الشيف',
          desc: 'بارباكوا مطهوة ببطء مع صلصة خضراء طازجة وتورتيلا دافئة.'
        }
      },
      logo: {
        heading: 'موثوق من عشّاق الطعام المحليين وذُكر في'
      },
      explore: {
        heading: 'استكشف القائمة',
        tacos: 'تاكو',
        bowls: 'أطباق',
        drinks: 'مشروبات',
        coming: 'قريباً.',
        chefNotes: 'ملاحظات الشيف: المفضل لدى الجميع مع كزبرة طازجة وعصير ليمون.',
        viewMore: 'عرض المزيد'
      },
      loyalty: {
        heading: 'الولاء والمكافآت',
        membersSave: 'الأعضاء يوفرون أكثر',
        points: 'نقطة',
        nextAt: 'المكافأة التالية عند {{points}}',
        freeDessert: 'تحلية مجانية',
        join: 'انضم لبرنامج المكافآت',
        perks: 'عرض المزايا'
      },
      why: {
        heading: 'لماذا تختار كانتينا',
        faster: { title: 'أسرع من التطبيقات', desc: 'من المطبخ إلى الباب مباشرةً، بلا تأخير من طرف ثالث.' },
        fees: { title: 'رسوم شفافة', desc: 'لا رسوم مفاجئة عند الدفع.' },
        oneTap: { title: 'حجوزات بلمسة واحدة', desc: 'توفر فوري ورسائل تأكيد.' },
        tracking: { title: 'تتبع مباشر', desc: 'تحديثات دقيقة بدقيقة.' },
        chef: { title: 'من إعداد الطهاة', desc: 'مكونات طازجة وقوائم موسمية.' },
        rewards: { title: 'مكافآت قيّمة', desc: 'نقاط على كل طلب ومزايا فورية.' }
      },
      faq: {
        heading: 'الأسئلة الشائعة',
        q1: {
          question: 'ما هو وقت التوصيل؟',
          answer: 'متوسط وقت التوصيل لدينا هو 25-35 دقيقة. نستخدم التتبع في الوقت الفعلي حتى تتمكن من رؤية موعد وصول طلبك بالضبط.'
        },
        q2: {
          question: 'هل تقدمون خيارات نباتية ونباتية صرفة؟',
          answer: 'نعم! لدينا مجموعة واسعة من الأطباق النباتية والنباتية الصرفة. قائمتنا تشمل التاكو النباتي والسلطات والأطباق الجانبية.'
        },
        q3: {
          question: 'هل يمكنني تخصيص طلبي؟',
          answer: 'بالتأكيد! يمكنك تخصيص أي طبق بإضافة أو إزالة المكونات. فقط أخبرنا بتفضيلاتك عند الطلب.'
        }
      },
      popular: {
        heading: 'الأكثر شعبية هذا الأسبوع',
        seeMenu: 'انظر القائمة الكاملة',
        coming: 'قريباً',
        chefSpecial: 'طبق الشيف الخاص {{num}}',
        notify: 'أخبرني',
        rating: '4.9/5 من أكثر من 2,400 من السكان المحليين'
      },
      cta: {
        title: 'مستعد لتجربة المكسيكي الأصيل؟',
        desc: 'انضم إلى آلاف العملاء الراضين الذين يختارون كانتينا للجودة والسرعة والخدمة.',
        socialProof: '2400+ عميل سعيد هذا الشهر',
        limited: 'عرض لفترة محدودة',
        start: 'ابدأ الطلب',
        reserve: 'احجز طاولة',
        endsTonight: 'ينتهي الليلة عند منتصف الليل'
      },
      offers: {
        heading: 'عروض موسمية',
        badge: 'Limited time',
        bundle: 'Taco Tuesday Bundle',
        deal: '2 tacos + drink — $9.99',
        endsIn: 'Ends in',
        orderBundle: 'Order bundle',
        viewDetails: 'View details'
      },
      seo: {
        title: 'كانتينا مارياتشي – Authentic Mexican, Modern Experience',
        description: 'Order online in seconds, reserve instantly, and track your delivery live. Authentic Mexican cuisine delivered fast.',
        keywords: 'Mexican food, tacos, delivery, restaurant, online ordering, table reservation'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'الرئيسية',
        menu: 'القائمة',
        orders: 'الطلبات',
        reservations: 'الحجوزات',
        account: 'الحساب',
        profile: 'الملف الشخصي',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        orderNow: 'اطلب الآن',
      },
      offer: {
        freeDelivery: 'اليوم فقط: توصيل مجاني للطلبات التي تزيد عن $25',
      },
      topbar: {
        open: 'مفتوح الآن',
        closed: 'مغلق الآن',
        eta: 'الوقت المتوقع ~ {{mins}}m',
        noSignup: 'لا حاجة للتسجيل',
        browse: 'Browse menu',
      },
      brand: 'كانتينـا',
      errors: {
        title: 'عذراً!',
        notFound: 'الصفحة المطلوبة غير موجودة.',
      },
      a11y: {
        toggleLanguage: 'تبديل اللغة',
        toggleTheme: 'تبديل السمة',
        close: 'إغلاق'
      },
      language: {
        reset: 'إعادة الإفتراض',
        select: 'حالة اللغة',
        current: 'اللغة الحالية'
      },
      theme: {
        toggle: 'تبديل السمة',
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام'
      },
      footer: {
        tagline: 'نكهات مكسيكية أصيلة بتجربة عصرية.',
        quickLinks: 'روابط سريعة',
        contact: 'تواصل',
        newsletter: 'احصل على 20% خصم على طلبك الأول + عروض حصرية 📧',
        emailPlaceholder: 'عنوان البريد الإلكتروني',
        join: 'انضم',
        privacy: 'الخصوصية',
        terms: 'الشروط',
        copyright: '© {{year}} {{brand}}. جميع الحقوق محفوظة.'
      }
    },
    menu: {
      hero: {
        title: 'استكشف قائمتنا',
        subtitle: 'أطباق من إعداد الطهاة، مكونات طازجة، وعروض موسمية.'
      },
      actions: {
        searchPlaceholder: 'ابحث عن الأطباق…',
        search: 'بحث',
        sortBy: 'ترتيب حسب',
        sort: {
          popular: 'الأكثر رواجاً',
          priceLow: 'السعر: من الأقل إلى الأعلى',
          priceHigh: 'السعر: من الأعلى إلى الأقل',
          newest: 'الأحدث'
        },
        add: 'أضف إلى الطلب',
        unavailable: 'غير متاح',
        noItems: 'لا توجد عناصر.'
      },
      categories: 'الفئات',
      categoriesAll: 'الكل',
      filters: {
        dietary: 'أنظمة غذائية',
        vegetarian: 'نباتي',
        vegan: 'نباتي صارم',
        glutenFree: 'خالٍ من الغلوتين',
        spicy: 'حار'
      },
      results: 'عرض {{count}} عنصر',
      badges: { new: 'جديد', popular: 'شائع' }
    },
    orders: {
      title: 'طلباتي',
      nav: { mine: 'طلباتي', track: 'تتبع' },
      table: { order: 'رقم الطلب', status: 'الحالة', total: 'الإجمالي', date: 'التاريخ', actions: 'إجراءات' },
      empty: 'لا توجد طلبات بعد.',
      create: 'إنشاء طلب',
      trackTitle: 'تتبع الطلب',
      trackDesc: 'أدخل رقم الطلب ورمز التتبع.',
      trackForm: {
        orderNumber: 'رقم الطلب',
        trackingCode: 'رمز التتبع',
        placeholderOrder: 'مثال: 12345',
        placeholderTracking: 'مثال: ABCD-7890',
        submit: 'تحقق من الحالة'
      },
      detailTitle: 'الطلب #{{orderNumber}}',
      statuses: { pending: 'قيد الانتظار', preparing: 'قيد التحضير', delivering: 'قيد التوصيل', completed: 'مكتمل', cancelled: 'ملغى' }
    },
    reservations: {
      hero: {
        title: 'احجز طاولة',
        subtitle: 'احجز طاولة في مطعمنا واستمتع بتجربة طعام مكسيكي أصيل',
        date: 'التاريخ',
        time: 'الوقت',
        partySize: 'حجم المجموعة',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        notes: 'ملاحظات خاصة',
        bookNow: 'احجز الآن',
        available: 'متاح',
        unavailable: 'غير متاح',
        selectDate: 'اختر التاريخ',
        selectTime: 'اختر الوقت',
        selectPartySize: 'اختر حجم المجموعة'
      },
      form: {
        required: 'مطلوب',
        invalidEmail: 'بريد إلكتروني غير صحيح',
        invalidPhone: 'رقم هاتف غير صحيح',
        minPartySize: 'الحد الأدنى: شخص واحد',
        maxPartySize: 'الحد الأقصى: 20 شخص',
        submit: 'إرسال الحجز',
        submitting: 'جاري الإرسال...',
        success: 'تم الحجز بنجاح!',
        error: 'خطأ في إجراء الحجز'
      },
      availability: {
        title: 'الأوقات المتاحة',
        today: 'اليوم',
        tomorrow: 'غداً',
        thisWeek: 'هذا الأسبوع',
        nextWeek: 'الأسبوع القادم',
        noAvailability: 'لا توجد أوقات متاحة',
        loading: 'Loading...'
      },
      confirmation: {
        title: 'تأكيد الحجز',
        message: 'سيتم إرسال تأكيد إلى بريدك الإلكتروني',
        reference: 'رقم المرجع',
        date: 'التاريخ',
        time: 'الوقت',
        partySize: 'حجم المجموعة',
        location: 'الموقع',
        contact: 'معلومات الاتصال'
      }
    },
    account: {
      hero: {
        title: 'حسابي',
        subtitle: 'إدارة معلوماتك الشخصية وطلباتك وحجوزاتك',
        welcome: 'مرحباً، {{name}}'
      },
      profile: {
        title: 'الملف الشخصي',
        personalInfo: 'المعلومات الشخصية',
        contactInfo: 'معلومات الاتصال',
        preferences: 'التفضيلات',
        save: 'حفظ التغييرات',
        saved: 'تم الحفظ',
        saving: 'جاري الحفظ...'
      },
      orders: {
        title: 'طلباتي',
        recent: 'الطلبات الأخيرة',
        all: 'جميع الطلبات',
        status: 'الحالة',
        date: 'التاريخ',
        total: 'الإجمالي',
        viewDetails: 'عرض التفاصيل',
        reorder: 'إعادة الطلب',
        track: 'تتبع الطلب',
        noOrders: 'لا توجد طلبات بعد'
      },
      reservations: {
        title: 'حجوزاتي',
        upcoming: 'الحجوزات القادمة',
        past: 'الحجوزات السابقة',
        cancel: 'إلغاء الحجز',
        modify: 'تعديل الحجز',
        noReservations: 'لا توجد حجوزات'
      },
      settings: {
        title: 'الإعدادات',
        notifications: 'الإشعارات',
        language: 'اللغة',
        currency: 'العملة',
        timezone: 'المنطقة الزمنية',
        privacy: 'الخصوصية',
        security: 'الأمان'
      },
      logout: 'تسجيل الخروج',
      deleteAccount: 'حذف الحساب'
    }
  },
  
  // Spanish translations
  es: {
    common: {
      success: 'Éxito',
      error: 'Error',
      statusSuccess: 'éxito',
      statusError: 'error',
      welcome: 'Bienvenido',
      loading: 'Cargando...',
      notFound: 'No encontrado',
      unauthorized: 'Acceso no autorizado',
      forbidden: 'Acceso prohibido',
      internalError: 'Error interno del servidor',
      badRequest: 'Solicitud incorrecta',
      created: 'Creado exitosamente',
      updated: 'Actualizado exitosamente',
      deleted: 'Eliminado exitosamente',
      operationFailed: 'Operación fallida',
      invalidRequest: 'Solicitud inválida',
      resourceNotFound: 'Recurso no encontrado',
      serverError: 'Error del servidor',
      maintenance: 'El servidor está en mantenimiento',
      rateLimited: 'Demasiadas solicitudes. Inténtalo más tarde.',
      timeout: 'Tiempo de espera agotado',
      dataRetrieved: 'Datos recuperados exitosamente',
      languageUpdated: 'Idioma actualizado exitosamente',
      languageReset: 'Idioma restablecido al predeterminado exitosamente'
    },
    events: {
      heading: 'Eventos y Catering',
      desc: 'Organizamos eventos especiales y catering para grupos grandes. Desde cumpleaños hasta eventos corporativos.',
      plan: 'Planificar Evento',
      catering: 'Servicio de Catering',
      q1: {
        question: '¿Cuál es el tamaño mínimo del grupo para eventos?',
        answer: 'Nuestro tamaño mínimo para eventos es de 20 personas. Para grupos más pequeños, recomendamos reservas regulares.'
      },
      q2: {
        question: '¿Ofrecen opciones vegetarianas y veganas?',
        answer: 'Sí, tenemos un menú completo de opciones vegetarianas y veganas. También podemos personalizar menús según sus necesidades dietéticas.'
      }
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      q1: {
        question: '¿Cuál es su tiempo de entrega?',
        answer: 'Nuestro tiempo promedio de entrega es de 25-35 minutos. Usamos seguimiento en tiempo real para que puedas ver exactamente cuándo llegará tu pedido.'
      },
      q2: {
        question: '¿Ofrecen opciones vegetarianas y veganas?',
        answer: '¡Sí! Tenemos una amplia selección de platos vegetarianos y veganos. Nuestro menú incluye tacos, bowls y guarniciones a base de plantas.'
      },
      q3: {
        question: '¿Puedo personalizar mi pedido?',
        answer: '¡Absolutamente! Puedes personalizar cualquier plato agregando o quitando ingredientes. Solo háznos saber tus preferencias al ordenar.'
      }
    },
    popular: {
      heading: 'Popular Esta Semana',
      seeMenu: 'Ver Menú Completo',
      coming: 'Próximamente',
      chefSpecial: 'Especial del Chef {{num}}',
      notify: 'Notifícame',
      rating: '4.9/5 de más de 2,400 locales'
    },
    auth: {
      loginSuccess: 'Connexion réussie',
      loginFailed: 'Échec de la connexion',
      logoutSuccess: 'Déconnexion réussie',
      registerSuccess: 'Inscription réussie',
      registerFailed: 'Échec de l\'inscription',
      invalidCredentials: 'Identifiants invalides',
      accountLocked: 'Le compte est verrouillé',
      accountNotVerified: 'Le compte n\'est pas vérifié',
      passwordResetSent: 'Lien de réinitialisation du mot de passe envoyé à votre email',
      passwordResetSuccess: 'Réinitialisation du mot de passe réussie',
      passwordResetFailed: 'Échec de la réinitialisation du mot de passe',
      tokenExpired: 'Le jeton a expiré',
      tokenInvalid: 'Jeton invalide',
      accessDenied: 'Accès refusé',
      sessionExpired: 'La session a expiré',
      emailAlreadyExists: 'L\'email existe déjà',
      usernameAlreadyExists: 'Le nom d\'utilisateur existe déjà',
      accountCreated: 'Compte créé avec succès',
      verificationEmailSent: 'Email de vérification envoyé',
      emailVerified: 'Email vérifié avec succès',
      invalidVerificationToken: 'Jeton de vérification invalide'
    },
    api: {
      dataRetrieved: 'Données récupérées avec succès',
      dataUpdated: 'Données mises à jour avec succès',
      dataCreated: 'Données créées avec succès',
      dataDeleted: 'Données supprimées avec succès',
      noDataFound: 'Aucune donnée trouvée',
      invalidApiKey: 'Clé API invalide',
      apiKeyExpired: 'La clé API a expiré',
      apiKeyRequired: 'Clé API requise',
      quotaExceeded: 'Quota API dépassé',
      methodNotAllowed: 'Méthode non autorisée',
      unsupportedMediaType: 'Type de média non pris en charge',
      payloadTooLarge: 'Charge utile trop volumineuse',
      requestEntityTooLarge: 'Entité de requête trop volumineuse',
      contentTypeRequired: 'En-tête Content-Type requis',
      jsonParseError: 'Format JSON invalide',
      missingRequiredField: 'Champ requis manquant: {{field}}',
      invalidFieldValue: 'Valeur invalide pour le champ: {{field}}',
      duplicateEntry: 'Entrée en double trouvée',
      constraintViolation: 'Violation de contrainte de base de données',
      connectionError: 'Erreur de connexion à la base de données',
      checkApiDocsAction: 'Vérifiez l\'URL ou consultez la documentation de l\'API pour des points de terminaison valides.'
    },
    validation: {
      required: '{{field}} est requis',
      email: 'Veuillez saisir une adresse email valide',
      minLength: '{{field}} doit contenir au moins {{min}} caractères',
      maxLength: '{{field}} ne doit pas dépasser {{max}} caractères',
      passwordStrength: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une minuscule et un chiffre',
      passwordMatch: 'Les mots de passe ne correspondent pas',
      invalidFormat: 'Format invalide pour {{field}}',
      invalidDate: 'Format de date invalide',
      futureDateRequired: 'La date doit être dans le futur',
      pastDateRequired: 'La date doit être dans le passé',
      invalidPhone: 'Format de numéro de téléphone invalide',
      invalidUrl: 'Format d\'URL invalide',
      numericOnly: '{{field}} ne doit contenir que des chiffres',
      alphabeticOnly: '{{field}} ne doit contenir que des lettres',
      alphanumericOnly: '{{field}} ne doit contenir que des lettres et des chiffres',
      invalidRange: '{{field}} doit être entre {{min}} et {{max}}',
      fileRequired: 'Le fichier est requis',
      invalidFileType: 'Type de fichier invalide. Types autorisés: {{types}}',
      fileSizeExceeded: 'La taille du fichier ne doit pas dépasser {{maxSize}}',
      invalidImageFormat: 'Format d\'image invalide',
      duplicateValue: '{{field}} existe déjà'
    },
    email: {
      subject: {
        welcome: 'Bienvenue sur {{appName}}',
        passwordReset: 'Demande de réinitialisation de mot de passe',
        emailVerification: 'Vérifiez votre adresse email',
        accountLocked: 'Alerte de sécurité du compte',
        loginAlert: 'Nouvelle connexion détectée'
      },
      greeting: 'Bonjour {{name}},',
      welcomeMessage: 'Bienvenue sur {{appName}}! Nous sommes ravis de vous accueillir.',
      passwordResetMessage: 'Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour continuer:',
      verificationMessage: 'Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous:',
      accountLockedMessage: 'Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion échouées.',
      loginAlertMessage: 'Nous avons détecté une nouvelle connexion à votre compte depuis {{location}} à {{time}}.',
      footer: 'Si vous n\'avez pas demandé cela, veuillez ignorer cet email ou contacter le support.',
      buttonText: {
        resetPassword: 'Réinitialiser le mot de passe',
        verifyEmail: 'Vérifier l\'email',
        contactSupport: 'Contacter le support'
      },
      expiryNotice: 'Ce lien expirera dans {{hours}} heures.',
      supportContact: 'Si vous avez besoin d\'aide, veuillez nous contacter à {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Élément du menu créé avec succès',
        itemUpdated: 'Élément du menu mis à jour avec succès',
        itemDeleted: 'Élément du menu supprimé avec succès',
        itemNotFound: 'Élément du menu non trouvé',
        categoryCreated: 'Catégorie du menu créée avec succès',
        categoryUpdated: 'Catégorie du menu mise à jour avec succès',
        categoryDeleted: 'Catégorie du menu supprimée avec succès',
        categoryNotFound: 'Catégorie du menu non trouvée',
        itemOutOfStock: 'Élément du menu en rupture de stock',
        invalidPrice: 'Prix invalide spécifié',
        duplicateItem: 'L\'élément du menu existe déjà'
      },
      orders: {
        orderCreated: 'Commande créée avec succès',
        orderUpdated: 'Commande mise à jour avec succès',
        orderCancelled: 'Commande annulée avec succès',
        orderNotFound: 'Commande non trouvée',
        orderStatusUpdated: 'Statut de la commande mis à jour avec succès',
        invalidOrderStatus: 'Statut de commande invalide',
        orderAlreadyCancelled: 'La commande est déjà annulée',
        orderCannotBeCancelled: 'La commande ne peut pas être annulée à ce stade',
        paymentRequired: 'Le paiement est requis pour finaliser la commande',
        insufficientInventory: 'Inventaire insuffisant pour certains articles',
        orderTotal: 'Total de la commande: {{amount}}',
        estimatedDelivery: 'Temps de livraison estimé: {{time}} minutes'
      },
      reservations: {
        reservationCreated: 'Réservation créée avec succès',
        reservationUpdated: 'Réservation mise à jour avec succès',
        reservationCancelled: 'Réservation annulée avec succès',
        reservationNotFound: 'Réservation non trouvée',
        reservationConfirmed: 'Réservation confirmée',
        tableNotAvailable: 'La table n\'est pas disponible à l\'heure demandée',
        invalidReservationTime: 'Heure de réservation invalide',
        reservationTooEarly: 'L\'heure de réservation est trop éloignée dans le futur',
        reservationTooLate: 'L\'heure de réservation est déjà passée',
        capacityExceeded: 'La taille du groupe dépasse la capacité de la table'
      }
    },
    home: {
      hero: {
        badge: 'Nouveau : programme de récompenses — gagnez des points à chaque commande',
        title: 'Cuisine mexicaine authentique. <primary>Livraison rapide.</primary>',
        desc: 'Des tacos de rue aux spécialités mijotées. Commandez en quelques secondes, réservez instantanément et suivez votre livraison en temps réel — tout au même endroit.',
        orderNow: 'Commander',
        reserve: 'Réserver une table',
        browseMenu: 'Voir le menu complet',
        rating: '4,9/5 de plus de 2 400 clients locaux',
        avgTime: 'Livraison en moins de 35 minutes en moyenne',
        openNow: 'Ouvert',
        closedNow: 'Fermé',
        eta: 'Arrivée estimée ~ {{m}} min',
        card: {
          title: 'Sélection du chef',
          desc: 'Barbacoa mijotée avec salsa verde fraîche et tortillas chaudes.'
        }
      },
      logo: {
        heading: 'De confianza por foodies locales et cité dans'
      },
      explore: {
        heading: 'Explora el menu',
        tacos: 'Tacos',
        bowls: 'Bol',
        drinks: 'Boissons',
        coming: 'Bientôt disponible.',
        chefNotes: 'Notes du chef : un favori du public, coriandolo et citron vert frais.',
        viewMore: 'Voir plus'
      },
      loyalty: {
        heading: 'Fidelidad et récompenses',
        membersSave: 'Les membres économisent davantage',
        points: 'points',
        nextAt: 'Prochaine récompense à {{points}}',
        freeDessert: 'Dessert offert',
        join: 'Rejoindre le programme',
        perks: 'Voir les avantages'
      },
      why: {
        heading: 'Pourquoi choisir Cantina',
        faster: { title: 'Plus rapide que les apps', desc: 'De la cuisine à votre porte, sans retards tiers.' },
        fees: { title: 'Frais transparents', desc: 'Aucune mauvaise surprise au paiement.' },
        oneTap: { title: 'Réservations en un geste', desc: 'Disponibilité en direct et confirmations SMS.' },
        tracking: { title: 'Suivi en direct', desc: 'Mises à jour minute par minute.' },
        chef: { title: 'Signé par nos chefs', desc: 'Ingrédients frais et menús de saison.' },
        rewards: { title: 'Des récompenses utiles', desc: 'Des points à chaque commande, des avantages immédiats.' }
      },
      faq: {
        heading: 'Questions fréquemment posées'
      },
      cta: {
        title: 'Prêt à expérimenter l\'authentique mexicain?',
        desc: 'Rejoignez des milliers de clients satisfaits qui choisissent Cantina pour la qualité, la vitesse et le service.',
        socialProof: '2 400+ clients heureux ce mois',
        limited: 'Offre à durée limitée',
        start: 'Commencer une commande',
        reserve: 'Réserver maintenant',
        endsTonight: 'Se termine cette nuit à minuit!'
      },
      offers: {
        heading: 'Offres saisonnières',
        badge: 'Offre limitée',
        bundle: 'Offre Taco Tuesday',
        deal: '2 tacos + boisson — 9,99 $',
        endsIn: 'Se termine dans',
        orderBundle: 'Commander l\'offre',
        viewDetails: 'Voir les détails'
      },
      seo: {
        title: 'Cantina Mariachi – Mexicain Authentique, Expérience Moderne',
        description: 'Commandez en ligne en quelques secondes, réservez instantanément et suivez votre livraison en direct.',
        keywords: 'mexicain, tacos, livraison, restaurant'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'Accueil',
        menu: 'Menu',
        orders: 'Commandes',
        reservations: 'Réservations',
        account: 'Compte',
        profile: 'Profil',
        login: 'Connexion',
        register: 'S\'inscrire',
        orderNow: 'Commander',
      },
      offer: {
        freeDelivery: 'Aujourd\'hui seulement : livraison gratuite dès 25 $',
      },
      topbar: {
        open: 'Ouvert',
        closed: 'Fermé',
        eta: 'Arrivée estimée ~ {{mins}} min',
        noSignup: 'Sans inscription',
        browse: 'Voir le menu',
      },
      brand: 'Cantina',
      errors: {
        title: '¡Ups!',
        notFound: 'La página demandée n\'a pas pu être trouvée.',
      },
      a11y: {
        toggleLanguage: 'Basculer la langue',
        toggleTheme: 'Basculer le thème',
        close: 'Fermer'
      },
      language: {
        reset: 'Réinitialiser par défaut',
        select: 'Sélectionner la langue',
        current: 'Langue actuelle'
      },
      theme: {
        toggle: 'Basculer le thème',
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système'
      },
      footer: {
        tagline: 'Saveurs mexicaines authentiques, expérience moderne.',
        quickLinks: 'Liens rapides',
        contact: 'Contact',
        newsletter: 'Obtenez 20% de réduction sur votre première commande + offres exclusives 📧',
        emailPlaceholder: 'Adresse email',
        join: 'Rejoindre',
        privacy: 'Confidentialité',
        terms: 'Conditions',
        copyright: '© {{year}} {{brand}}. Tous droits réservés.'
      }
    },
    menu: {
      hero: {
        title: 'Découvrez notre menu',
        subtitle: 'Plats signés par nos chefs, ingrédients frais et spécialités de saison.'
      },
      actions: {
        searchPlaceholder: 'Rechercher des plats…',
        search: 'Rechercher',
        sortBy: 'Trier par',
        sort: {
          popular: 'Les plus populaires',
          priceLow: 'Prezzo: croissant',
          priceHigh: 'Prezzo: décroissant',
          newest: 'Les plus récents'
        },
        add: 'Ajouter à la commande',
        unavailable: 'Indisponible',
        noItems: 'Aucun article trouvé.'
      },
      categories: 'Catégories',
      categoriesAll: 'Toutes',
      filters: {
        dietary: 'Préférences alimentaires',
        vegetarian: 'Végétarien',
        vegan: 'Végétalien',
        glutenFree: 'Sans gluten',
        spicy: 'Épicé'
      },
      results: 'Affichage de {{count}} articles',
      badges: { new: 'Nouveau', popular: 'Populaire' }
    },
    orders: {
      title: 'Mes commandes',
      nav: { mine: 'Mes commandes', track: 'Suivi' },
      table: { order: 'Commande #', status: 'Statut', total: 'Total', date: 'Date', actions: 'Actions' },
      empty: 'Aucune commande pour le moment.',
      create: 'Créer une commande',
      trackTitle: 'Suivre une commande',
      trackDesc: 'Saisissez votre numéro de commande et le code de suivi.',
      trackForm: {
        orderNumber: 'Numéro de commande',
        trackingCode: 'Code de suivi',
        placeholderOrder: 'ex. 12345',
        placeholderTracking: 'ex. ABCD-7890',
        submit: 'Vérifier le statut'
      },
      detailTitle: 'Commande #{{orderNumber}}',
      statuses: { pending: 'En attente', preparing: 'En préparation', delivering: 'En livraison', completed: 'Terminée', cancelled: 'Annulée' }
    },
    reservations: {
      hero: {
        title: 'Réserver une table',
        subtitle: 'Réservez une table dans notre restaurant et vérifiez la disponibilité.',
        date: 'Date',
        time: 'Heure',
        partySize: 'Convives',
        name: 'Nom complet',
        phone: 'Téléphone',
        notes: 'Notes (optionnel)',
        bookNow: 'Réserver',
        available: 'Disponible',
        unavailable: 'Indisponible',
        selectDate: 'Sélectionner la date',
        selectTime: 'Sélectionner l\'heure',
        selectPartySize: 'Sélectionner le nombre de convives'
      },
      form: {
        required: 'Requis',
        invalidEmail: 'Email invalide',
        invalidPhone: 'Numéro de téléphone invalide',
        minPartySize: 'Minimum: 1 personne',
        maxPartySize: 'Maximum: 20 personnes',
        submit: 'Soumettre la réservation',
        submitting: 'Soumission...',
        success: 'Réservation réussie!',
        error: 'Erreur lors de la réservation'
      },
      availability: {
        title: 'Heures disponibles',
        today: 'Aujourd\'hui',
        tomorrow: 'Demain',
        thisWeek: 'Cette semaine',
        nextWeek: 'La próxima semana',
        noAvailability: 'Aucune heure disponible',
        loading: 'Chargement...'
      },
      confirmation: {
        title: 'Confirmation de réservation',
        message: 'Une confirmation sera envoyée à votre email',
        reference: 'Numéro de référence',
        date: 'Date',
        time: 'Heure',
        partySize: 'Nombre de convives',
        location: 'Emplacement',
        contact: 'Informations de contact'
      }
    },
    account: {
      hero: {
        title: 'Mon compte',
        subtitle: 'Gérez votre profil et vos préférences.',
        welcome: 'Bonjour, {{name}}'
      },
      profile: {
        title: 'Profil',
        personalInfo: 'Informations personnelles',
        contactInfo: 'Informations de contact',
        preferences: 'Préférences',
        save: 'Enregistrer',
        saved: 'Enregistré',
        saving: 'Enregistrement...'
      },
      orders: {
        title: 'Mes commandes',
        recent: 'Commandes récentes',
        all: 'Toutes les commandes',
        status: 'Statut',
        date: 'Date',
        total: 'Total',
        viewDetails: 'Voir les détails',
        reorder: 'Commander à nouveau',
        track: 'Suivre la commande',
        noOrders: 'Aucune commande pour le moment'
      },
      reservations: {
        title: 'Mes réservations',
        upcoming: 'Réservations à venir',
        past: 'Réservations passées',
        cancel: 'Annuler la réservation',
        modify: 'Modifier la réservation',
        noReservations: 'Aucune réservation'
      },
      settings: {
        title: 'Paramètres',
        notifications: 'Notifications',
        language: 'Langue',
        currency: 'Devise',
        timezone: 'Fuseau horaire',
        privacy: 'Confidentialité',
        security: 'Sécurité'
      },
      logout: 'Déconnexion',
      deleteAccount: 'Supprimer le compte'
    },
    home: {
      hero: {
        badge: 'Nuevo: lanzamiento de recompensas — gana puntos en cada pedido',
        title: 'Mexicano Auténtico. <primary>Entregado Rápido.</primary>',
        desc: 'Desde tacos de calle hasta especialidades cocinadas lentamente. Ordena en segundos, reserva una mesa instantáneamente y rastrea tu entrega en tiempo real — todo en un solo lugar.',
        orderNow: 'Ordenar Ahora',
        reserve: 'Reservar Mesa',
        browseMenu: 'Ver menú completo',
        rating: '4.9/5 de más de 2,400 comensales locales',
        avgTime: 'Entrega en menos de 35 minutos en promedio',
        openNow: 'Abierto ahora',
        closedNow: 'Cerrado ahora',
        eta: 'ETA ~ {{m}}m',
        card: {
          title: 'Selección del Chef',
          desc: 'Barbacoa cocinada lentamente con salsa verde fresca y tortillas calientes.'
        }
      },
      logo: {
        heading: 'Confiado por foodies locales y destacado en'
      },
      explore: {
        heading: 'Explora el menú',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Bebidas',
        coming: 'Próximamente.',
        chefNotes: 'Notas del chef: favorito de la multitud con cilantro fresco y lima.',
        viewMore: 'Ver más'
      },
      loyalty: {
        heading: 'Lealtad y Recompensas',
        membersSave: 'Los miembros ahorran más',
        points: 'puntos',
        nextAt: 'Próxima recompensa en {{points}}',
        freeDessert: 'Postre gratis',
        join: 'Unirse a recompensas',
        perks: 'Ver beneficios'
      },
      why: {
        heading: 'Por qué elegir Cantina',
        faster: { title: 'Más rápido que las apps', desc: 'Directo de la cocina a tu puerta, sin demoras de terceros.' },
        fees: { title: 'Tarifas transparentes', desc: 'Sin cargos sorpresa al pagar.' },
        oneTap: { title: 'Reservas de un toque', desc: 'Disponibilidad en vivo y confirmaciones por SMS.' },
        tracking: { title: 'Rastreo en vivo', desc: 'Actualizaciones minuto a minuto.' },
        chef: { title: 'Hecho por chefs', desc: 'Ingredientes frescos y menús de temporada.' },
        rewards: { title: 'Recompensas que importan', desc: 'Puntos en cada pedido, beneficios instantáneos.' }
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        q1: {
          question: '¿Cuál es su tiempo de entrega?',
          answer: 'Nuestro tiempo promedio de entrega es de 25-35 minutos. Usamos seguimiento en tiempo real para que puedas ver exactamente cuándo llegará tu pedido.'
        },
        q2: {
          question: '¿Ofrecen opciones vegetarianas y veganas?',
          answer: '¡Sí! Tenemos una amplia selección de platos vegetarianos y veganos. Nuestro menú incluye tacos, bowls y guarniciones a base de plantas.'
        },
        q3: {
          question: '¿Puedo personalizar mi pedido?',
          answer: '¡Absolutamente! Puedes personalizar cualquier plato agregando o quitando ingredientes. Solo háznos saber tus preferencias al ordenar.'
        }
      },
      popular: {
        heading: 'Popular Esta Semana',
        seeMenu: 'Ver Menú Completo',
        coming: 'Próximamente',
        chefSpecial: 'Especial del Chef {{num}}',
        notify: 'Notifícame',
        rating: '4.9/5 de más de 2,400 locales'
      },
      cta: {
        title: '¿Listo para experimentar el mexicano auténtico?',
        desc: 'Únete a miles de clientes satisfechos que eligen Cantina por calidad, velocidad y servicio.',
        socialProof: '2,400+ clientes felices este mes',
        limited: 'Oferta por tiempo limitado',
        start: 'Comenzar a Ordenar',
        reserve: 'Reservar Mesa',
        endsTonight: '¡Termina esta noche a medianoche!'
      },
      offers: {
        heading: 'Ofertas de Temporada',
        badge: 'Tiempo Limitado',
        bundle: 'Paquete Taco Tuesday',
        deal: '2 tacos + bebida — $9.99',
        endsIn: 'Termina en',
        orderBundle: 'Ordenar Paquete',
        viewDetails: 'Ver Detalles'
      },
      seo: {
        title: 'Cantina Mariachi – Mexicano Auténtico, Experiencia Moderna',
        description: 'Ordena en línea en segundos, reserva instantáneamente y rastrea tu entrega en vivo.',
        keywords: 'mexicano, tacos, entrega, restaurante'
      }
    }
  },
  
  // French translations
  fr: {
    common: {
      success: 'Succès',
      error: 'Erreur',
      statusSuccess: 'succès',
      statusError: 'erreur',
      welcome: 'Bienvenue',
      loading: 'Chargement...',
      notFound: 'Non trouvé',
      unauthorized: 'Accès non autorisé',
      forbidden: 'Accès interdit',
      internalError: 'Erreur interne du serveur',
      badRequest: 'Mauvaise requête',
      created: 'Créé avec succès',
      updated: 'Mis à jour avec succès',
      deleted: 'Supprimé avec succès',
      operationFailed: 'Opération échouée',
      invalidRequest: 'Requête invalide',
      resourceNotFound: 'Ressource non trouvée',
      serverError: 'Erreur du serveur',
      maintenance: 'Le serveur est en maintenance',
      rateLimited: 'Trop de requêtes. Réessayez plus tard.',
      timeout: 'Délai d\'attente dépassé',
      dataRetrieved: 'Données récupérées avec succès',
      languageUpdated: 'Langue mise à jour avec succès',
      languageReset: 'Langue réinitialisée par défaut avec succès'
    },
    events: {
      heading: 'Événements et Traiteur',
      desc: 'Nous organisons des événements spéciaux et des services de traiteur pour de grands groupes. Des anniversaires aux événements d\'entreprise.',
      plan: 'Planifier l\'Événement',
      catering: 'Service de Traiteur',
      q1: {
        question: 'Quelle est la taille minimale du groupe pour les événements ?',
        answer: 'Notre taille minimale de groupe pour les événements est de 20 personnes. Pour les groupes plus petits, nous recommandons des réservations régulières.'
      },
      q2: {
        question: 'Proposez-vous des options végétariennes et véganes ?',
        answer: 'Oui, nous avons un menu complet d\'options végétariennes et véganes. Nous pouvons également personnaliser les menus selon vos besoins alimentaires.'
      }
    },
    faq: {
      heading: 'Questions Fréquemment Posées',
      q1: {
        question: 'Quel est votre temps de livraison ?',
        answer: 'Notre temps de livraison moyen est de 25-35 minutes. Nous utilisons le suivi en temps réel pour que vous puissiez voir exactement quand votre commande arrivera.'
      },
      q2: {
        question: 'Proposez-vous des options végétariennes et véganes ?',
        answer: 'Oui ! Nous avons une large sélection de plats végétariens et végans. Notre menu comprend des tacos, des bols et des accompagnements à base de plantes.'
      },
      q3: {
        question: 'Puis-je personnaliser ma commande ?',
        answer: 'Absolument ! Vous pouvez personnaliser n\'importe quel plat en ajoutant ou en supprimant des ingrédients. Faites-nous simplement savoir vos préférences lors de la commande.'
      }
    },
    popular: {
      heading: 'Populaire Cette Semaine',
      seeMenu: 'Voir le Menu Complet',
      coming: 'Bientôt Disponible',
      chefSpecial: 'Spécial du Chef {{num}}',
      notify: 'Me Notifier',
      rating: '4,9/5 de plus de 2 400 habitants locaux'
    },
    auth: {
      loginSuccess: 'Connexion réussie',
      loginFailed: 'Échec de la connexion',
      logoutSuccess: 'Déconnexion réussie',
      registerSuccess: 'Inscription réussie',
      registerFailed: 'Échec de l\'inscription',
      invalidCredentials: 'Identifiants invalides',
      accountLocked: 'Le compte est verrouillé',
      accountNotVerified: 'Le compte n\'est pas vérifié',
      passwordResetSent: 'Lien de réinitialisation du mot de passe envoyé à votre email',
      passwordResetSuccess: 'Réinitialisation du mot de passe réussie',
      passwordResetFailed: 'Échec de la réinitialisation du mot de passe',
      tokenExpired: 'Le jeton a expiré',
      tokenInvalid: 'Jeton invalide',
      accessDenied: 'Accès refusé',
      sessionExpired: 'La session a expiré',
      emailAlreadyExists: 'L\'email existe déjà',
      usernameAlreadyExists: 'Le nom d\'utilisateur existe déjà',
      accountCreated: 'Compte créé avec succès',
      verificationEmailSent: 'Email de vérification envoyé',
      emailVerified: 'Email vérifié avec succès',
      invalidVerificationToken: 'Jeton de vérification invalide'
    },
    api: {
      dataRetrieved: 'Données récupérées avec succès',
      dataUpdated: 'Données mises à jour avec succès',
      dataCreated: 'Données créées avec succès',
      dataDeleted: 'Données supprimées avec succès',
      noDataFound: 'Aucune donnée trouvée',
      invalidApiKey: 'Clé API invalide',
      apiKeyExpired: 'La clé API a expiré',
      apiKeyRequired: 'Clé API requise',
      quotaExceeded: 'Quota API dépassé',
      methodNotAllowed: 'Méthode non autorisée',
      unsupportedMediaType: 'Type de média non pris en charge',
      payloadTooLarge: 'Charge utile trop volumineuse',
      requestEntityTooLarge: 'Entité de requête trop volumineuse',
      contentTypeRequired: 'En-tête Content-Type requis',
      jsonParseError: 'Format JSON invalide',
      missingRequiredField: 'Champ requis manquant: {{field}}',
      invalidFieldValue: 'Valeur invalide pour le champ: {{field}}',
      duplicateEntry: 'Entrée en double trouvée',
      constraintViolation: 'Violation de contrainte de base de données',
      connectionError: 'Erreur de connexion à la base de données',
      checkApiDocsAction: 'Vérifiez l\'URL ou consultez la documentation de l\'API pour des points de terminaison valides.'
    },
    validation: {
      required: '{{field}} est requis',
      email: 'Veuillez saisir une adresse email valide',
      minLength: '{{field}} doit contenir au moins {{min}} caractères',
      maxLength: '{{field}} ne doit pas dépasser {{max}} caractères',
      passwordStrength: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une minuscule et un chiffre',
      passwordMatch: 'Les mots de passe ne correspondent pas',
      invalidFormat: 'Format invalide pour {{field}}',
      invalidDate: 'Format de date invalide',
      futureDateRequired: 'La date doit être dans le futur',
      pastDateRequired: 'La date doit être dans le passé',
      invalidPhone: 'Format de numéro de téléphone invalide',
      invalidUrl: 'Format d\'URL invalide',
      numericOnly: '{{field}} ne doit contenir que des chiffres',
      alphabeticOnly: '{{field}} ne doit contenir que des lettres',
      alphanumericOnly: '{{field}} ne doit contenir que des lettres et des chiffres',
      invalidRange: '{{field}} doit être entre {{min}} et {{max}}',
      fileRequired: 'Le fichier est requis',
      invalidFileType: 'Type de fichier invalide. Types autorisés: {{types}}',
      fileSizeExceeded: 'La taille du fichier ne doit pas dépasser {{maxSize}}',
      invalidImageFormat: 'Format d\'image invalide',
      duplicateValue: '{{field}} existe déjà'
    },
    email: {
      subject: {
        welcome: 'Bienvenue sur {{appName}}',
        passwordReset: 'Demande de réinitialisation de mot de passe',
        emailVerification: 'Vérifiez votre adresse email',
        accountLocked: 'Alerte de sécurité du compte',
        loginAlert: 'Nouvelle connexion détectée'
      },
      greeting: 'Bonjour {{name}},',
      welcomeMessage: 'Bienvenue sur {{appName}}! Nous sommes ravis de vous accueillir.',
      passwordResetMessage: 'Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour continuer:',
      verificationMessage: 'Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous:',
      accountLockedMessage: 'Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion échouées.',
      loginAlertMessage: 'Nous avons détecté une nouvelle connexion à votre compte depuis {{location}} à {{time}}.',
      footer: 'Si vous n\'avez pas demandé cela, veuillez ignorer cet email ou contacter le support.',
      buttonText: {
        resetPassword: 'Réinitialiser le mot de passe',
        verifyEmail: 'Vérifier l\'email',
        contactSupport: 'Contacter le support'
      },
      expiryNotice: 'Ce lien expirera dans {{hours}} heures.',
      supportContact: 'Si vous avez besoin d\'aide, veuillez nous contacter à {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Élément du menu créé avec succès',
        itemUpdated: 'Élément du menu mis à jour avec succès',
        itemDeleted: 'Élément du menu supprimé avec succès',
        itemNotFound: 'Élément du menu non trouvé',
        categoryCreated: 'Catégorie du menu créée avec succès',
        categoryUpdated: 'Catégorie du menu mise à jour avec succès',
        categoryDeleted: 'Catégorie du menu supprimée avec succès',
        categoryNotFound: 'Catégorie du menu non trouvée',
        itemOutOfStock: 'Élément du menu en rupture de stock',
        invalidPrice: 'Prix invalide spécifié',
        duplicateItem: 'L\'élément du menu existe déjà'
      },
      orders: {
        orderCreated: 'Commande créée avec succès',
        orderUpdated: 'Commande mise à jour avec succès',
        orderCancelled: 'Commande annulée avec succès',
        orderNotFound: 'Commande non trouvée',
        orderStatusUpdated: 'Statut de la commande mis à jour avec succès',
        invalidOrderStatus: 'Statut de commande invalide',
        orderAlreadyCancelled: 'La commande est déjà annulée',
        orderCannotBeCancelled: 'La commande ne peut pas être annulée à ce stade',
        paymentRequired: 'Le paiement est requis pour finaliser la commande',
        insufficientInventory: 'Inventaire insuffisant pour certains articles',
        orderTotal: 'Total de la commande: {{amount}}',
        estimatedDelivery: 'Temps de livraison estimé: {{time}} minutes'
      },
      reservations: {
        reservationCreated: 'Réservation créée avec succès',
        reservationUpdated: 'Réservation mise à jour avec succès',
        reservationCancelled: 'Réservation annulée avec succès',
        reservationNotFound: 'Réservation non trouvée',
        reservationConfirmed: 'Réservation confirmée',
        tableNotAvailable: 'La table n\'est pas disponible à l\'heure demandée',
        invalidReservationTime: 'Heure de réservation invalide',
        reservationTooEarly: 'L\'heure de réservation est trop éloignée dans le futur',
        reservationTooLate: 'L\'heure de réservation est déjà passée',
        capacityExceeded: 'La taille du groupe dépasse la capacité de la table'
      }
    },
    home: {
      hero: {
        badge: 'Nouveau : programme de récompenses — gagnez des points à chaque commande',
        title: 'Cuisine mexicaine authentique. <primary>Livraison rapide.</primary>',
        desc: 'Des tacos de rue aux spécialités mijotées. Commandez en quelques secondes, réservez instantanément et suivez votre livraison en temps réel — tout au même endroit.',
        orderNow: 'Commander',
        reserve: 'Réserver une table',
        browseMenu: 'Voir le menu complet',
        rating: '4,9/5 de plus de 2 400 clients locaux',
        avgTime: 'Livraison en moins de 35 minutes en moyenne',
        openNow: 'Ouvert',
        closedNow: 'Fermé',
        eta: 'Arrivée estimée ~ {{m}} min',
        card: {
          title: 'Sélection du chef',
          desc: 'Barbacoa mijotée avec salsa verde fraîche et tortillas chaudes.'
        }
      },
      logo: {
        heading: 'De confianza por foodies locales et cité dans'
      },
      explore: {
        heading: 'Explora el menu',
        tacos: 'Tacos',
        bowls: 'Bol',
        drinks: 'Boissons',
        coming: 'Bientôt disponible.',
        chefNotes: 'Notes du chef : un favori du public, coriandolo et citron vert frais.',
        viewMore: 'Voir plus'
      },
      loyalty: {
        heading: 'Fidelidad et récompenses',
        membersSave: 'Les membres économisent davantage',
        points: 'points',
        nextAt: 'Prochaine récompense à {{points}}',
        freeDessert: 'Dessert offert',
        join: 'Rejoindre le programme',
        perks: 'Voir les avantages'
      },
      why: {
        heading: 'Pourquoi choisir Cantina',
        faster: { title: 'Plus rapide que les apps', desc: 'De la cuisine à votre porte, sans retards tiers.' },
        fees: { title: 'Frais transparents', desc: 'Aucune mauvaise surprise au paiement.' },
        oneTap: { title: 'Réservations en un geste', desc: 'Disponibilité en direct et confirmations SMS.' },
        tracking: { title: 'Suivi en direct', desc: 'Mises à jour minute par minute.' },
        chef: { title: 'Signé par nos chefs', desc: 'Ingrédients frais et menús de saison.' },
        rewards: { title: 'Des récompenses utiles', desc: 'Des points à chaque commande, des avantages immédiats.' }
      },
      faq: {
        heading: 'Questions fréquemment posées'
      },
      cta: {
        title: 'Prêt à expérimenter l\'authentique mexicain?',
        desc: 'Rejoignez des milliers de clients satisfaits qui choisissent Cantina pour la qualité, la vitesse et le service.',
        socialProof: '2 400+ clients heureux ce mois',
        limited: 'Offre à durée limitée',
        start: 'Commencer une commande',
        reserve: 'Réserver maintenant',
        endsTonight: 'Se termine cette nuit à minuit!'
      },
      offers: {
        heading: 'Offres saisonnières',
        badge: 'Offre limitée',
        bundle: 'Offre Taco Tuesday',
        deal: '2 tacos + boisson — 9,99 $',
        endsIn: 'Se termine dans',
        orderBundle: 'Commander l\'offre',
        viewDetails: 'Voir les détails'
      },
      seo: {
        title: 'Cantina Mariachi – Mexicain Authentique, Expérience Moderne',
        description: 'Commandez en ligne en quelques secondes, réservez instantanément et suivez votre livraison en direct.',
        keywords: 'mexicain, tacos, livraison, restaurant'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'Accueil',
        menu: 'Menu',
        orders: 'Commandes',
        reservations: 'Réservations',
        account: 'Compte',
        profile: 'Profil',
        login: 'Connexion',
        register: 'S\'inscrire',
        orderNow: 'Commander',
      },
      offer: {
        freeDelivery: 'Aujourd\'hui seulement : livraison gratuite dès 25 $',
      },
      topbar: {
        open: 'Ouvert',
        closed: 'Fermé',
        eta: 'Arrivée estimée ~ {{mins}} min',
        noSignup: 'Sans inscription',
        browse: 'Voir le menu',
      },
      brand: 'Cantina',
      errors: {
        title: '¡Ups!',
        notFound: 'La página demandée n\'a pas pu être trouvée.',
      },
      a11y: {
        toggleLanguage: 'Basculer la langue',
        toggleTheme: 'Basculer le thème',
        close: 'Fermer'
      },
      language: {
        reset: 'Réinitialiser par défaut',
        select: 'Sélectionner la langue',
        current: 'Langue actuelle'
      },
      theme: {
        toggle: 'Basculer le thème',
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système'
      },
      footer: {
        tagline: 'Saveurs mexicaines authentiques, expérience moderne.',
        quickLinks: 'Liens rapides',
        contact: 'Contact',
        newsletter: 'Obtenez 20% de réduction sur votre première commande + offres exclusives 📧',
        emailPlaceholder: 'Adresse email',
        join: 'Rejoindre',
        privacy: 'Confidentialité',
        terms: 'Conditions',
        copyright: '© {{year}} {{brand}}. Tous droits réservés.'
      }
    },
    menu: {
      hero: {
        title: 'Découvrez notre menu',
        subtitle: 'Plats signés par nos chefs, ingrédients frais et spécialités de saison.'
      },
      actions: {
        searchPlaceholder: 'Rechercher des plats…',
        search: 'Rechercher',
        sortBy: 'Trier par',
        sort: {
          popular: 'Les plus populaires',
          priceLow: 'Prix: croissant',
          priceHigh: 'Prix: décroissant',
          newest: 'Les plus récents'
        },
        add: 'Ajouter à la commande',
        unavailable: 'Indisponible',
        noItems: 'Aucun article trouvé.'
      },
      categories: 'Catégories',
      categoriesAll: 'Toutes',
      filters: {
        dietary: 'Préférences alimentaires',
        vegetarian: 'Végétarien',
        vegan: 'Végétalien',
        glutenFree: 'Sans gluten',
        spicy: 'Épicé'
      },
      results: 'Affichage de {{count}} articles',
      badges: { new: 'Nouveau', popular: 'Populaire' }
    },
    orders: {
      title: 'Mes commandes',
      nav: { mine: 'Mes commandes', track: 'Suivi' },
      table: { order: 'Commande #', status: 'Statut', total: 'Total', date: 'Date', actions: 'Actions' },
      empty: 'Aucune commande pour le moment.',
      create: 'Créer une commande',
      trackTitle: 'Suivre une commande',
      trackDesc: 'Saisissez votre numéro de commande et le code de suivi.',
      trackForm: {
        orderNumber: 'Numéro de commande',
        trackingCode: 'Code de suivi',
        placeholderOrder: 'ex. 12345',
        placeholderTracking: 'ex. ABCD-7890',
        submit: 'Vérifier le statut'
      },
      detailTitle: 'Commande #{{orderNumber}}',
      statuses: { pending: 'En attente', preparing: 'En préparation', delivering: 'En livraison', completed: 'Terminée', cancelled: 'Annulée' }
    },
    reservations: {
      hero: {
        title: 'Réserver une table',
        subtitle: 'Réservez une table dans notre restaurant et vérifiez la disponibilité.',
        date: 'Date',
        time: 'Heure',
        partySize: 'Convives',
        name: 'Nom complet',
        phone: 'Téléphone',
        notes: 'Notes (optionnel)',
        bookNow: 'Réserver',
        available: 'Disponible',
        unavailable: 'Indisponible',
        selectDate: 'Sélectionner la date',
        selectTime: 'Sélectionner l\'heure',
        selectPartySize: 'Sélectionner le nombre de convives'
      },
      form: {
        required: 'Requis',
        invalidEmail: 'Email invalide',
        invalidPhone: 'Numéro de téléphone invalide',
        minPartySize: 'Minimum: 1 personne',
        maxPartySize: 'Maximum: 20 personnes',
        submit: 'Soumettre la réservation',
        submitting: 'Soumission...',
        success: 'Réservation réussie!',
        error: 'Erreur lors de la réservation'
      },
      availability: {
        title: 'Heures disponibles',
        today: 'Aujourd\'hui',
        tomorrow: 'Demain',
        thisWeek: 'Cette semaine',
        nextWeek: 'La próxima semana',
        noAvailability: 'Aucune heure disponible',
        loading: 'Chargement...'
      },
      confirmation: {
        title: 'Confirmation de réservation',
        message: 'Une confirmation sera envoyée à votre email',
        reference: 'Numéro de référence',
        date: 'Date',
        time: 'Heure',
        partySize: 'Nombre de convives',
        location: 'Emplacement',
        contact: 'Informations de contact'
      }
    },
    account: {
      hero: {
        title: 'Mon compte',
        subtitle: 'Gérez votre profil et vos préférences.',
        welcome: 'Bonjour, {{name}}'
      },
      profile: {
        title: 'Profil',
        personalInfo: 'Informations personnelles',
        contactInfo: 'Informations de contact',
        preferences: 'Préférences',
        save: 'Enregistrer',
        saved: 'Enregistré',
        saving: 'Enregistrement...'
      },
      orders: {
        title: 'Mes commandes',
        recent: 'Commandes récentes',
        all: 'Toutes les commandes',
        status: 'Statut',
        date: 'Date',
        total: 'Total',
        viewDetails: 'Voir les détails',
        reorder: 'Commander à nouveau',
        track: 'Suivre la commande',
        noOrders: 'Aucune commande pour le moment'
      },
      reservations: {
        title: 'Mes réservations',
        upcoming: 'Réservations à venir',
        past: 'Réservations passées',
        cancel: 'Annuler la réservation',
        modify: 'Modifier la réservation',
        noReservations: 'Aucune réservation'
      },
      settings: {
        title: 'Paramètres',
        notifications: 'Notifications',
        language: 'Langue',
        currency: 'Devise',
        timezone: 'Fuseau horaire',
        privacy: 'Confidentialité',
        security: 'Sécurité'
      },
      logout: 'Déconnexion',
      deleteAccount: 'Supprimer le compte'
    }
  },
  
  // German translations
  de: {
    common: {
      success: 'Erfolg',
      error: 'Fehler',
      statusSuccess: 'erfolg',
      statusError: 'fehler',
      welcome: 'Willkommen',
      loading: 'Wird geladen...',
      notFound: 'Nicht gefunden',
      unauthorized: 'Nicht autorisierter Zugriff',
      forbidden: 'Zugriff verboten',
      internalError: 'Interner Serverfehler',
      badRequest: 'Ungültige Anfrage',
      created: 'Erfolgreich erstellt',
      updated: 'Erfolgreich aktualisiert',
      deleted: 'Erfolgreich gelöscht',
      operationFailed: 'Operation fehlgeschlagen',
      invalidRequest: 'Ungültige Anfrage',
      resourceNotFound: 'Ressource nicht gefunden',
      serverError: 'Serverfehler aufgetreten',
      maintenance: 'Server wird gewartet',
      rateLimited: 'Zu viele Anfragen. Versuchen Sie es später erneut.',
      timeout: 'Anfrage-Timeout',
      dataRetrieved: 'Daten erfolgreich abgerufen',
      languageUpdated: 'Sprache erfolgreich aktualisiert',
      languageReset: 'Sprache erfolgreich auf Standard zurückgesetzt'
    },
    events: {
      heading: 'Veranstaltungen & Catering',
      desc: 'Wir organisieren besondere Veranstaltungen und Catering für große Gruppen. Von Geburtstagen bis zu Firmenveranstaltungen.',
      plan: 'Veranstaltung Planen',
      catering: 'Catering-Service',
      q1: {
        question: 'Was ist die Mindestgröße für Veranstaltungen?',
        answer: 'Unsere Mindestgruppengröße für Veranstaltungen beträgt 20 Personen. Für kleinere Gruppen empfehlen wir reguläre Reservierungen.'
      },
      q2: {
        question: 'Bieten Sie vegetarische und vegane Optionen?',
        answer: 'Ja, wir haben ein vollständiges Menü mit vegetarischen und veganen Optionen. Wir können auch Menüs nach Ihren Ernährungsbedürfnissen anpassen.'
      }
    },
    faq: {
      heading: 'Häufig Gestellte Fragen',
      q1: {
        question: 'Wie ist Ihre Lieferzeit?',
        answer: 'Unsere durchschnittliche Lieferzeit beträgt 25-35 Minuten. Wir verwenden Echtzeit-Tracking, damit Sie genau sehen können, wann Ihre Bestellung ankommt.'
      },
      q2: {
        question: 'Bieten Sie vegetarische und vegane Optionen?',
        answer: 'Ja! Wir haben eine große Auswahl an vegetarischen und veganen Gerichten. Unser Menü umfasst pflanzliche Tacos, Schüsseln und Beilagen.'
      },
      q3: {
        question: 'Kann ich meine Bestellung anpassen?',
        answer: 'Absolut! Sie können jedes Gericht anpassen, indem Sie Zutaten hinzufügen oder entfernen. Lassen Sie uns einfach Ihre Präferenzen bei der Bestellung wissen.'
      }
    },
    popular: {
      heading: 'Diese Woche Beliebt',
      seeMenu: 'Vollständiges Menü Anzeigen',
      coming: 'Demnächst Verfügbar',
      chefSpecial: 'Chef-Spezial {{num}}',
      notify: 'Benachrichtigen Sie Mich',
      rating: '4,9/5 von über 2.400 Einheimischen'
    },
    auth: {
      loginSuccess: 'Anmeldung erfolgreich',
      loginFailed: 'Anmeldung fehlgeschlagen',
      logoutSuccess: 'Abmeldung erfolgreich',
      registerSuccess: 'Registrierung erfolgreich',
      registerFailed: 'Registrierung fehlgeschlagen',
      invalidCredentials: 'Ungültige Anmeldedaten',
      accountLocked: 'Konto ist gesperrt',
      accountNotVerified: 'Konto ist nicht verifiziert',
      passwordResetSent: 'Link zum Zurücksetzen des Passworts an Ihre E-Mail gesendet',
      passwordResetSuccess: 'Passwort erfolgreich zurückgesetzt',
      passwordResetFailed: 'Passwort-Zurücksetzung fehlgeschlagen',
      tokenExpired: 'Token ist abgelaufen',
      tokenInvalid: 'Ungültiger Token',
      accessDenied: 'Zugriff verweigert',
      sessionExpired: 'Sitzung ist abgelaufen',
      emailAlreadyExists: 'E-Mail existiert bereits',
      usernameAlreadyExists: 'Benutzername existiert bereits',
      accountCreated: 'Konto erfolgreich erstellt',
      verificationEmailSent: 'Verifizierungs-E-Mail gesendet',
      emailVerified: 'E-Mail erfolgreich verifiziert',
      invalidVerificationToken: 'Ungültiger Verifizierungs-Token'
    },
    api: {
      dataRetrieved: 'Daten erfolgreich abgerufen',
      dataUpdated: 'Daten erfolgreich aktualisiert',
      dataCreated: 'Daten erfolgreich erstellt',
      dataDeleted: 'Daten erfolgreich gelöscht',
      noDataFound: 'Keine Daten gefunden',
      invalidApiKey: 'Ungültiger API-Schlüssel',
      apiKeyExpired: 'API-Schlüssel ist abgelaufen',
      apiKeyRequired: 'API-Schlüssel erforderlich',
      quotaExceeded: 'API-Kontingent überschritten',
      methodNotAllowed: 'Methode nicht erlaubt',
      unsupportedMediaType: 'Nicht unterstützter Medientyp',
      payloadTooLarge: 'Nutzdaten zu groß',
      requestEntityTooLarge: 'Anfrage-Entität zu groß',
      contentTypeRequired: 'Content-Type-Header erforderlich',
      jsonParseError: 'Ungültiges JSON-Format',
      missingRequiredField: 'Erforderliches Feld fehlt: {{field}}',
      invalidFieldValue: 'Ungültiger Wert für Feld: {{field}}',
      duplicateEntry: 'Doppelter Eintrag gefunden',
      constraintViolation: 'Datenbank-Constraint-Verletzung',
      connectionError: 'Datenbankverbindungsfehler',
      checkApiDocsAction: 'Überprüfen Sie die URL oder sehen Sie in der API-Dokumentation nach gültigen Endpunkten.'
    },
    validation: {
      required: '{{field}} ist erforderlich',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      minLength: '{{field}} muss mindestens {{min}} Zeichen lang sein',
      maxLength: '{{field}} darf nicht mehr als {{max}} Zeichen haben',
      passwordStrength: 'Das Passwort muss mindestens 8 Zeichen, einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten',
      passwordMatch: 'Passwörter stimmen nicht überein',
      invalidFormat: 'Ungültiges Format für {{field}}',
      invalidDate: 'Ungültiges Datumsformat',
      futureDateRequired: 'Das Datum muss in der Zukunft liegen',
      pastDateRequired: 'Das Datum muss in der Vergangenheit liegen',
      invalidPhone: 'Ungültiges Telefonnummernformat',
      invalidUrl: 'Ungültiges URL-Format',
      numericOnly: '{{field}} darf nur Zahlen enthalten',
      alphabeticOnly: '{{field}} darf nur Buchstaben enthalten',
      alphanumericOnly: '{{field}} darf nur Buchstaben und Zahlen enthalten',
      invalidRange: '{{field}} muss zwischen {{min}} und {{max}} liegen',
      fileRequired: 'Datei ist erforderlich',
      invalidFileType: 'Ungültiger Dateityp. Erlaubte Typen: {{types}}',
      fileSizeExceeded: 'Dateigröße darf {{maxSize}} nicht überschreiten',
      invalidImageFormat: 'Ungültiges Bildformat',
      duplicateValue: '{{field}} existiert bereits'
    },
    email: {
      subject: {
        welcome: 'Willkommen bei {{appName}}',
        passwordReset: 'Passwort zurücksetzen',
        emailVerification: 'E-Mail-Adresse bestätigen',
        accountLocked: 'Konto-Sicherheitswarnung',
        loginAlert: 'Neue Anmeldung erkannt'
      },
      greeting: 'Hallo {{name}},',
      welcomeMessage: 'Willkommen bei {{appName}}! Wir freuen uns, Sie bei uns zu haben.',
      passwordResetMessage: 'Sie haben eine Passwort-Zurücksetzung angefordert. Klicken Sie auf den Link unten, um fortzufahren:',
      verificationMessage: 'Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den Link unten klicken:',
      accountLockedMessage: 'Ihr Konto wurde aufgrund mehrerer fehlgeschlagener Anmeldeversuche vorübergehend gesperrt.',
      loginAlertMessage: 'Wir haben eine neue Anmeldung in Ihr Konto von {{location}} um {{time}} erkannt.',
      footer: 'Falls Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail oder kontaktieren Sie den Support.',
      buttonText: {
        resetPassword: 'Passwort zurücksetzen',
        verifyEmail: 'E-Mail bestätigen',
        contactSupport: 'Support kontaktieren'
      },
      expiryNotice: 'Dieser Link läuft in {{hours}} Stunden ab.',
      supportContact: 'Wenn Sie Hilfe benötigen, kontaktieren Sie uns unter {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Menüelement erfolgreich erstellt',
        itemUpdated: 'Menüelement erfolgreich aktualisiert',
        itemDeleted: 'Menüelement erfolgreich gelöscht',
        itemNotFound: 'Menüelement nicht gefunden',
        categoryCreated: 'Menükategorie erfolgreich erstellt',
        categoryUpdated: 'Menükategorie erfolgreich aktualisiert',
        categoryDeleted: 'Menükategorie erfolgreich gelöscht',
        categoryNotFound: 'Menükategorie nicht gefunden',
        itemOutOfStock: 'Menüelement ist nicht vorrätig',
        invalidPrice: 'Ungültiger Preis angegeben',
        duplicateItem: 'Menüelement existiert bereits'
      },
      orders: {
        orderCreated: 'Bestellung erfolgreich erstellt',
        orderUpdated: 'Bestellung erfolgreich aktualisiert',
        orderCancelled: 'Bestellung erfolgreich storniert',
        orderNotFound: 'Bestellung nicht gefunden',
        orderStatusUpdated: 'Bestellstatus erfolgreich aktualisiert',
        invalidOrderStatus: 'Ungültiger Bestellstatus',
        orderAlreadyCancelled: 'Bestellung ist bereits storniert',
        orderCannotBeCancelled: 'Bestellung kann in diesem Stadium nicht storniert werden',
        paymentRequired: 'Zahlung ist erforderlich, um die Bestellung abzuschließen',
        insufficientInventory: 'Unzureichender Bestand für einige Artikel',
        orderTotal: 'Bestellsumme: {{amount}}',
        estimatedDelivery: 'Geschätzte Lieferzeit: {{time}} Minuten'
      },
      reservations: {
        reservationCreated: 'Reservierung erfolgreich erstellt',
        reservationUpdated: 'Reservierung erfolgreich aktualisiert',
        reservationCancelled: 'Reservierung erfolgreich storniert',
        reservationNotFound: 'Reservierung nicht gefunden',
        reservationConfirmed: 'Reservierung bestätigt',
        tableNotAvailable: 'Tisch ist zur gewünschten Zeit nicht verfügbar',
        invalidReservationTime: 'Ungültige Reservierungszeit',
        reservationTooEarly: 'Reservierungszeit liegt zu weit in der Zukunft',
        reservationTooLate: 'Reservierungszeit ist bereits vergangen',
        capacityExceeded: 'Gruppengröße überschreitet die Tischkapazität'
      }
    },
    home: {
      hero: {
        badge: 'Neu: Belohnungen gestartet — sammeln Sie Punkte bei jeder Bestellung',
        title: 'Authentische mexikanische Küche. <primary>Schnell geliefert.</primary>',
        desc: 'Von Straßen-Tacos bis zu langsam geschmorten Spezialitäten. Bestellen Sie in Sekunden, reservieren Sie sofort und verfolgen Sie Ihre Lieferung in Echtzeit — alles an einem Ort.',
        orderNow: 'Jetzt bestellen',
        reserve: 'Tisch reservieren',
        browseMenu: 'Gesamte Speisekarte ansehen',
        rating: '4,9/5 von 2.400 Gästen',
        avgTime: 'Lieferung im Schnitt unter 35 Minuten',
        openNow: 'Jetzt geöffnet',
        closedNow: 'Jetzt geschlossen',
        eta: 'Ankunft ~ {{m}} Min',
        card: {
          title: 'Empfehlung des Küchenchefs',
          desc: 'Langsam geschmorte Barbacoa mit frischer Salsa Verde und warmen Tortillas.'
        }
      },
      logo: {
        heading: 'Beliebt bei Foodies und vorgestellt in'
      },
      explore: {
        heading: 'Entdecke die Speisekarte',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Getränke',
        coming: 'Demnächst.',
        chefNotes: 'Notizen des Küchenchefs: Publikumsfavorit mit frischem Koriander und Limette.',
        viewMore: 'Mehr ansehen'
      },
      loyalty: {
        heading: 'Treue & Prämien',
        membersSave: 'Mitglieder sparen mehr',
        points: 'Punkte',
        nextAt: 'Nächste Prämie bei {{points}}',
        freeDessert: 'Gratis Dessert',
        join: 'Dem Programm beitreten',
        perks: 'Vorteile ansehen'
      },
      why: {
        heading: 'Warum Cantina wählen',
        faster: { title: 'Schneller als Apps', desc: 'Direkt aus der Küche zur Tür, ohne Drittanbieter‑Verzögerungen.' },
        fees: { title: 'Transparente Gebühren', desc: 'Keine Überraschungen an der Kasse.' },
        oneTap: { title: 'Reservieren mit einem Tipp', desc: 'Verfügbarkeit in Echtzeit und SMS‑Bestätigungen.' },
        tracking: { title: 'Live‑Tracking', desc: 'Minutengenaue Updates.' },
        chef: { title: 'Von Köchen kreiert', desc: 'Ingrédients frais et menús de saison.' },
        rewards: { title: 'Prämien, die zählen', desc: 'Punkte bei jeder Bestellung, Vorteile sofort.' }
      },
      faq: {
        heading: 'Häufige Fragen'
      },
      cta: {
        title: 'Bereit für authentisches Mexikanisch?',
        desc: 'Schließen Sie sich Tausenden zufriedener Kunden an, die Cantina für Qualität, Geschwindigkeit und Service wählen.',
        socialProof: '2.400+ glückliche Kunden diesen Monat',
        limited: 'Zeitlich begrenztes Angebot',
        start: 'Bestellung beginnen',
        reserve: 'Tisch reservieren',
        endsTonight: 'Endet heute Nacht um Mitternacht'
      },
      offers: {
        heading: 'Saisonangebote',
        badge: 'Begrenzte Zeit',
        bundle: 'Taco-Dienstag-Paket',
        deal: '2 Tacos + Getränk — 9,99 $',
        endsIn: 'Endet in',
        orderBundle: 'Paket bestellen',
        viewDetails: 'Details anzeigen'
      },
      seo: {
        title: 'Cantina Mariachi – Authentisches Mexikanisch, Moderne Erfahrung',
        description: 'Online bestellen in Sekunden, sofort reservieren und Lieferung live verfolgen. Authentische mexikanische Küche schnell geliefert.',
        keywords: 'mexikanisches Essen, Tacos, Lieferung, Restaurant, Online-Bestellung, Tischreservierung'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'Startseite',
        menu: 'Speisekarte',
        orders: 'Bestellungen',
        reservations: 'Reservierungen',
        account: 'Konto',
        profile: 'Profil',
        login: 'Anmelden',
        register: 'Registrieren',
        orderNow: 'Jetzt bestellen',
      },
      offer: {
        freeDelivery: 'Nur heute: Gratis‑Lieferung ab 25 $',
      },
      topbar: {
        open: 'Jetzt geöffnet',
        closed: 'Jetzt geschlossen',
        eta: 'Ankunft ~ {{mins}} Min',
        noSignup: 'Keine Registrierung nötig',
        browse: 'Speisekarte ansehen',
      },
      brand: 'Cantina',
      errors: {
        title: 'Hoppla!',
        notFound: 'Die angeforderte Seite konnte nicht gefunden werden.',
      },
      a11y: {
        toggleLanguage: 'Sprache umschalten',
        toggleTheme: 'Design umschalten',
        close: 'Schließen'
      },
      language: {
        reset: 'Auf Standard zurücksetzen',
        select: 'Sprache auswählen',
        current: 'Aktuelle Sprache'
      },
      theme: {
        toggle: 'Design umschalten',
        light: 'Hell',
        dark: 'Dunkel',
        system: 'System'
      },
      footer: {
        tagline: 'Authentische mexikanische Aromen, moderne Erfahrung.',
        quickLinks: 'Schnellzugriff',
        contact: 'Kontakt',
        newsletter: 'Erhalten Sie 20% Rabatt auf Ihre erste Bestellung + exklusive Angebote 📧',
        emailPlaceholder: 'E-Mail-Adresse',
        join: 'Beitreten',
        privacy: 'Datenschutz',
        terms: 'AGB',
        copyright: '© {{year}} {{brand}}. Alle Rechte vorbehalten.'
      }
    },
    menu: {
      hero: {
        title: 'Entdecke unsere Speisekarte',
        subtitle: 'Von Köchen kreierte Gerichte, frische Zutaten und saisonale Specials.'
      },
      actions: {
        searchPlaceholder: 'Gerichte suchen…',
        search: 'Suchen',
        sortBy: 'Sortieren nach',
        sort: {
          popular: 'Am beliebtesten',
          priceLow: 'Preis: aufsteigend',
          priceHigh: 'Preis: absteigend',
          newest: 'Neueste'
        },
        add: 'Zur Bestellung hinzufügen',
        unavailable: 'Nicht verfügbar',
        noItems: 'Keine Einträge gefunden.'
      },
      categories: 'Kategorien',
      categoriesAll: 'Alle',
      filters: {
        dietary: 'Ernährung',
        vegetarian: 'Vegetarisch',
        vegan: 'Vegan',
        glutenFree: 'Glutenfrei',
        spicy: 'Scharf'
      },
      results: '{{count}} Artikel',
      badges: { new: 'Neu', popular: 'Beliebt' }
    },
    orders: {
      title: 'Meine Bestellungen',
      nav: { mine: 'Meine Bestellungen', track: 'Verfolgen' },
      table: { order: 'Bestellung #', status: 'Status', total: 'Gesamt', date: 'Datum', actions: 'Aktionen' },
      empty: 'Noch keine Bestellungen.',
      create: 'Bestellung erstellen',
      trackTitle: 'Bestellung verfolgen',
      trackDesc: 'Geben Sie Ihre Bestellnummer und den Verfolgungscode ein.',
      trackForm: {
        orderNumber: 'Bestellnummer',
        trackingCode: 'Verfolgungscode',
        placeholderOrder: 'z.B. 12345',
        placeholderTracking: 'z.B. ABCD-7890',
        submit: 'Status prüfen'
      },
      detailTitle: 'Bestellung #{{orderNumber}}',
      statuses: { pending: 'Ausstehend', preparing: 'Wird zubereitet', delivering: 'Wird geliefert', completed: 'Abgeschlossen', cancelled: 'Storniert' }
    },
    reservations: {
      hero: {
        title: 'Tisch reservieren',
        subtitle: 'Reservieren Sie einen Tisch in unserem Restaurant und genießen Sie eine authentische mexikanische Küchenerfahrung',
        date: 'Datum',
        time: 'Zeit',
        partySize: 'Gruppengröße',
        name: 'Name',
        email: 'E-Mail',
        phone: 'Telefon',
        notes: 'Besondere Notizen',
        bookNow: 'Jetzt reservieren',
        available: 'Verfügbar',
        unavailable: 'Nicht verfügbar',
        selectDate: 'Datum auswählen',
        selectTime: 'Zeit auswählen',
        selectPartySize: 'Gruppengröße auswählen'
      },
      form: {
        required: 'Erforderlich',
        invalidEmail: 'Ungültige E-Mail',
        invalidPhone: 'Ungültige Telefonnummer',
        minPartySize: 'Minimum: 1 Person',
        maxPartySize: 'Maximum: 20 Personen',
        submit: 'Reservierung einreichen',
        submitting: 'Wird eingereicht...',
        success: 'Reservierung erfolgreich!',
        error: 'Fehler bei der Reservierung'
      },
      availability: {
        title: 'Verfügbare Zeiten',
        today: 'Heute',
        tomorrow: 'Morgen',
        thisWeek: 'Diese Woche',
        nextWeek: 'Nächste Woche',
        noAvailability: 'Keine Zeiten verfügbar',
        loading: 'Wird geladen...'
      },
      confirmation: {
        title: 'Reservierungsbestätigung',
        message: 'Eine Bestätigung wird an Ihre E-Mail gesendet',
        reference: 'Referenznummer',
        date: 'Datum',
        time: 'Zeit',
        partySize: 'Gruppengröße',
        location: 'Standort',
        contact: 'Kontaktinformationen'
      }
    },
    account: {
      hero: {
        title: 'Mein Konto',
        subtitle: 'Verwalten Sie Ihre persönlichen Informationen, Bestellungen und Reservierungen',
        welcome: 'Hallo, {{name}}'
      },
      profile: {
        title: 'Profil',
        personalInfo: 'Persönliche Informationen',
        contactInfo: 'Kontaktinformationen',
        preferences: 'Einstellungen',
        save: 'Änderungen speichern',
        saved: 'Gespeichert',
        saving: 'Wird gespeichert...'
      },
      orders: {
        title: 'Meine Bestellungen',
        recent: 'Neueste Bestellungen',
        all: 'Alle Bestellungen',
        status: 'Status',
        date: 'Datum',
        total: 'Gesamt',
        viewDetails: 'Details anzeigen',
        reorder: 'Erneut bestellen',
        track: 'Bestellung verfolgen',
        noOrders: 'Noch keine Bestellungen'
      },
      reservations: {
        title: 'Meine Reservierungen',
        upcoming: 'Kommende Reservierungen',
        past: 'Vergangene Reservierungen',
        cancel: 'Reservierung stornieren',
        modify: 'Reservierung ändern',
        noReservations: 'Keine Reservierungen'
      },
      settings: {
        title: 'Einstellungen',
        notifications: 'Benachrichtigungen',
        language: 'Sprache',
        currency: 'Währung',
        timezone: 'Zeitzone',
        privacy: 'Datenschutz',
        security: 'Sicherheit'
      },
      logout: 'Abmelden',
      deleteAccount: 'Konto löschen'
    }
  },
  
  // Italian translations
  it: {
    common: {
      success: 'Successo',
      error: 'Errore',
      statusSuccess: 'successo',
      statusError: 'errore',
      welcome: 'Benvenuto',
      loading: 'Caricamento...',
      notFound: 'Non trovato',
      unauthorized: 'Accesso non autorizzato',
      forbidden: 'Accesso vietato',
      internalError: 'Errore interno del server',
      badRequest: 'Richiesta non valida',
      created: 'Creato con successo',
      updated: 'Aggiornato con successo',
      deleted: 'Eliminato con successo',
      operationFailed: 'Operazione fallita',
      invalidRequest: 'Richiesta non valida',
      resourceNotFound: 'Risorsa non trovata',
      serverError: 'Errore del server',
      maintenance: 'Il server è in manutenzione',
      rateLimited: 'Troppe richieste. Riprova più tardi.',
      timeout: 'Timeout della richiesta',
      dataRetrieved: 'Dati recuperati con successo',
      languageUpdated: 'Lingua aggiornata con successo',
      languageReset: 'Lingua reimpostata al valore predefinito con successo'
    },
    events: {
      heading: 'Eventi e Catering',
      desc: 'Organizziamo eventi speciali e servizi di catering per grandi gruppi. Dai compleanni agli eventi aziendali.',
      plan: 'Pianifica Evento',
      catering: 'Servizio di Catering',
      q1: {
        question: 'Qual è la dimensione minima del gruppo per gli eventi?',
        answer: 'La nostra dimensione minima del gruppo per gli eventi è di 20 persone. Per gruppi più piccoli, raccomandiamo prenotazioni regolari.'
      },
      q2: {
        question: 'Offrite opzioni vegetariane e vegane?',
        answer: 'Sì, abbiamo un menu completo di opzioni vegetariane e vegane. Possiamo anche personalizzare i menu secondo le vostre esigenze alimentari.'
      }
    },
    faq: {
      heading: 'Domande Frequenti',
      q1: {
        question: 'Qual è il vostro tempo di consegna?',
        answer: 'Il nostro tempo di consegna medio è di 25-35 minuti. Utilizziamo il tracciamento in tempo reale così puoi vedere esattamente quando arriverà il tuo ordine.'
      },
      q2: {
        question: 'Offrite opzioni vegetariane e vegane?',
        answer: 'Sì! Abbiamo un\'ampia selezione di piatti vegetariani e vegani. Il nostro menu include tacos, bowl e contorni a base di piante.'
      },
      q3: {
        question: 'Posso personalizzare il mio ordine?',
        answer: 'Assolutamente! Puoi personalizzare qualsiasi piatto aggiungendo o rimuovendo ingredienti. Faccelo semplicemente sapere le tue preferenze quando ordini.'
      }
    },
    popular: {
      heading: 'Popolare Questa Settimana',
      seeMenu: 'Vedi Menu Completo',
      coming: 'Prossimamente',
      chefSpecial: 'Speciale dello Chef {{num}}',
      notify: 'Notificami',
      rating: '4,9/5 da oltre 2.400 locali'
    },
    auth: {
      loginSuccess: 'Accesso effettuato con successo',
      loginFailed: 'Accesso fallito',
      logoutSuccess: 'Disconnessione effettuata con successo',
      registerSuccess: 'Registrazione completata con successo',
      registerFailed: 'Registrazione fallita',
      invalidCredentials: 'Credenziali non valide',
      accountLocked: 'Account bloccato',
      accountNotVerified: 'Account non verificato',
      passwordResetSent: 'Link per il reset della password inviato alla tua email',
      passwordResetSuccess: 'Reset della password completato con successo',
      passwordResetFailed: 'Reset della password fallito',
      tokenExpired: 'Il token è scaduto',
      tokenInvalid: 'Token non valido',
      accessDenied: 'Accesso negato',
      sessionExpired: 'La sessione è scaduta',
      emailAlreadyExists: 'L\'email esiste già',
      usernameAlreadyExists: 'Il nome utente esiste già',
      accountCreated: 'Account creato con successo',
      verificationEmailSent: 'Email di verifica inviata',
      emailVerified: 'Email verificata con successo',
      invalidVerificationToken: 'Token di verifica non valido'
    },
    api: {
      dataRetrieved: 'Dati recuperati con successo',
      dataUpdated: 'Dati aggiornati con successo',
      dataCreated: 'Dati creati con successo',
      dataDeleted: 'Dati eliminati con successo',
      noDataFound: 'Nessun dato trovato',
      invalidApiKey: 'Chiave API non valida',
      apiKeyExpired: 'La chiave API è scaduta',
      apiKeyRequired: 'Chiave API richiesta',
      quotaExceeded: 'Quota API superata',
      methodNotAllowed: 'Metodo non consentito',
      unsupportedMediaType: 'Tipo di media non supportato',
      payloadTooLarge: 'Payload troppo grande',
      requestEntityTooLarge: 'Entità della richiesta troppo grande',
      contentTypeRequired: 'Header Content-Type richiesto',
      jsonParseError: 'Formato JSON non valido',
      missingRequiredField: 'Campo richiesto mancante: {{field}}',
      invalidFieldValue: 'Valore non valido per il campo: {{field}}',
      duplicateEntry: 'Voce duplicata trovata',
      constraintViolation: 'Violazione del vincolo del database',
      connectionError: 'Errore di connessione al database',
      checkApiDocsAction: 'Controlla l\'URL o consulta la documentazione dell\'API per endpoint validi.'
    },
    validation: {
      required: '{{field}} è richiesto',
      email: 'Inserisci un indirizzo email valido',
      minLength: '{{field}} deve contenere almeno {{min}} caratteri',
      maxLength: '{{field}} non deve superare {{max}} caratteri',
      passwordStrength: 'La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero',
      passwordMatch: 'Le password non corrispondono',
      invalidFormat: 'Formato non valido per {{field}}',
      invalidDate: 'Formato data non valido',
      futureDateRequired: 'La data deve essere nel futuro',
      pastDateRequired: 'La data deve essere nel passato',
      invalidPhone: 'Formato numero di telefono non valido',
      invalidUrl: 'Formato URL non valido',
      numericOnly: '{{field}} deve contenere solo numeri',
      alphabeticOnly: '{{field}} deve contenere solo lettere',
      alphanumericOnly: '{{field}} deve contenere solo lettere e numeri',
      invalidRange: '{{field}} deve essere tra {{min}} e {{max}}',
      fileRequired: 'Il file è richiesto',
      invalidFileType: 'Tipo di file non valido. Tipi consentiti: {{types}}',
      fileSizeExceeded: 'La dimensione del file non deve superare {{maxSize}}',
      invalidImageFormat: 'Formato immagine non valido',
      duplicateValue: '{{field}} esiste già'
    },
    email: {
      subject: {
        welcome: 'Benvenuto su {{appName}}',
        passwordReset: 'Richiesta di reset password',
        emailVerification: 'Verifica il tuo indirizzo email',
        accountLocked: 'Avviso di sicurezza account',
        loginAlert: 'Nuovo accesso rilevato'
      },
      greeting: 'Ciao {{name}},',
      welcomeMessage: 'Benvenuto su {{appName}}! Siamo entusiasti di averti con noi.',
      passwordResetMessage: 'Hai richiesto un reset della password. Clicca sul link qui sotto per continuare:',
      verificationMessage: 'Per favore verifica il tuo indirizzo email cliccando sul link qui sotto:',
      accountLockedMessage: 'Il tuo account è stato temporaneamente bloccato a causa di diversi tentativi di accesso falliti.',
      loginAlertMessage: 'Abbiamo rilevato un nuovo accesso al tuo account da {{location}} alle {{time}}.',
      footer: 'Se non hai richiesto questo, ignora questa email o contatta il supporto.',
      buttonText: {
        resetPassword: 'Reset password',
        verifyEmail: 'Verifica email',
        contactSupport: 'Contatta supporto'
      },
      expiryNotice: 'Questo link scadrà tra {{hours}} ore.',
      supportContact: 'Se hai bisogno di aiuto, contattaci a {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Elemento del menu creato con successo',
        itemUpdated: 'Elemento del menu aggiornato con successo',
        itemDeleted: 'Elemento del menu eliminato con successo',
        itemNotFound: 'Elemento del menu non trovato',
        categoryCreated: 'Categoria del menu creata con successo',
        categoryUpdated: 'Categoria del menu aggiornata con successo',
        categoryDeleted: 'Categoria del menu eliminata con successo',
        categoryNotFound: 'Categoria del menu non trovata',
        itemOutOfStock: 'Elemento del menu esaurito',
        invalidPrice: 'Prezzo non valido specificato',
        duplicateItem: 'L\'elemento del menu esiste già'
      },
      orders: {
        orderCreated: 'Ordine creato con successo',
        orderUpdated: 'Ordine aggiornato con successo',
        orderCancelled: 'Ordine cancellato con successo',
        orderNotFound: 'Ordine non trovato',
        orderStatusUpdated: 'Stato dell\'ordine aggiornato con successo',
        invalidOrderStatus: 'Stato ordine non valido',
        orderAlreadyCancelled: 'L\'ordine è già cancellato',
        orderCannotBeCancelled: 'L\'ordine non può essere cancellato in questa fase',
        paymentRequired: 'Il pagamento è richiesto per completare l\'ordine',
        insufficientInventory: 'Inventario insufficiente per alcuni articoli',
        orderTotal: 'Totale ordine: {{amount}}',
        estimatedDelivery: 'Tempo di consegna stimato: {{time}} minuti'
      },
      reservations: {
        reservationCreated: 'Prenotazione creata con successo',
        reservationUpdated: 'Prenotazione aggiornata con successo',
        reservationCancelled: 'Prenotazione cancellata con successo',
        reservationNotFound: 'Prenotazione non trovata',
        reservationConfirmed: 'Prenotazione confermata',
        tableNotAvailable: 'Il tavolo non è disponibile all\'ora richiesta',
        invalidReservationTime: 'Orario prenotazione non valido',
        reservationTooEarly: 'L\'orario di prenotazione è troppo lontano nel futuro',
        reservationTooLate: 'L\'orario di prenotazione è già passato',
        capacityExceeded: 'La dimensione del gruppo supera la capacità del tavolo'
      }
    },
    home: {
      hero: {
        badge: 'Nuovo: lancio ricompense — guadagna punti su ogni ordine',
        title: 'Messicano autentico. <primary>Consegnato velocemente.</primary>',
        desc: 'Dai tacos di strada alle specialità cucinate a fuoco lento. Ordina in secondi, prenota istantaneamente e traccia la tua consegna in tempo reale — tutto in un posto.',
        orderNow: 'Ordina ora',
        reserve: 'Prenota un tavolo',
        browseMenu: 'Sfoglia il menu completo',
        rating: '4,9/5 da oltre 2.400 clienti locali',
        avgTime: 'Consegna in media sotto i 35 minuti',
        openNow: 'Aperto ora',
        closedNow: 'Chiuso ora',
        eta: 'Arrivo stimato ~ {{m}} min',
        card: {
          title: 'Scelta dello chef',
          desc: 'Barbacoa cucinata a fuoco lento con salsa verde fresca e tortillas calde.'
        }
      },
      logo: {
        heading: 'Fidato dai foodie locali e presentato in'
      },
      explore: {
        heading: 'Esplora il menu',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Bevande',
        coming: 'Prossimamente.',
        chefNotes: 'Note dello chef: preferito dal pubblico con coriandolo fresco e lime.',
        viewMore: 'Vedi di più'
      },
      loyalty: {
        heading: 'Fedeltà e ricompense',
        membersSave: 'I membri risparmiano di più',
        points: 'punti',
        nextAt: 'Prossima ricompensa a {{points}}',
        freeDessert: 'Dolce gratis',
        join: 'Unisciti al programma',
        perks: 'Vedi i vantaggi'
      },
      why: {
        heading: 'Perché scegliere Cantina',
        faster: { title: 'Più veloce delle app', desc: 'Direttamente dalla cucina alla porta, senza ritardi di terze parti.' },
        fees: { title: 'Tariffe trasparenti', desc: 'Nessuna sorpresa al checkout.' },
        oneTap: { title: 'Prenotazioni con un tocco', desc: 'Disponibilità in tempo reale e conferme SMS.' },
        tracking: { title: 'Tracciamento live', desc: 'Aggiornamenti minuto per minuto.' },
        chef: { title: 'Creato dagli chef', desc: 'Ingredienti freschi e menu stagionali.' },
        rewards: { title: 'Ricompense che contano', desc: 'Punti su ogni ordine, vantaggi istantanei.' }
      },
      faq: {
        heading: 'Domande frequenti'
      },
      cta: {
        title: 'Pronto a provare l\'autentico messicano?',
        desc: 'Unisciti a migliaia di clienti soddisfatti che scelgono Cantina per qualità, velocità e servizio.',
        socialProof: '2.400+ clienti felici questo mese',
        limited: 'Offerta a tempo limitato',
        start: 'Inizia a ordinare',
        reserve: 'Prenota tavolo',
        endsTonight: 'Finisce stanotte a mezzanotte'
      },
      offers: {
        heading: 'Offerte stagionali',
        badge: 'Tempo limitato',
        bundle: 'Pacchetto Taco Tuesday',
        deal: '2 tacos + bevanda — €9,99',
        endsIn: 'Finisce tra',
        orderBundle: 'Ordina pacchetto',
        viewDetails: 'Vedi dettagli'
      },
      seo: {
        title: 'Cantina Mariachi – Messicano Autentico, Esperienza Moderna',
        description: 'Ordina online in secondi, prenota istantaneamente e traccia la tua consegna live.',
        keywords: 'cibo messicano, tacos, consegna, ristorante'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        orders: 'Ordini',
        reservations: 'Prenotazioni',
        account: 'Account',
        profile: 'Profilo',
        login: 'Accedi',
        register: 'Registrati',
        orderNow: 'Ordina ora',
      },
      offer: {
        freeDelivery: 'Solo oggi: consegna gratuita su ordini oltre €25',
      },
      topbar: {
        open: 'Aperto ora',
        closed: 'Chiuso ora',
        eta: 'Arrivo stimato ~ {{mins}} min',
        noSignup: 'Nessuna registrazione richiesta',
        browse: 'Sfoglia menu',
      },
      brand: 'Cantina',
      errors: {
        title: 'Ops!',
        notFound: 'La pagina richiesta non è stata trovata.',
      },
      a11y: {
        toggleLanguage: 'Cambia lingua',
        toggleTheme: 'Cambia tema',
        close: 'Chiudi'
      },
      language: {
        reset: 'Ripristina predefinito',
        select: 'Seleziona lingua',
        current: 'Lingua corrente'
      },
      theme: {
        toggle: 'Cambia tema',
        light: 'Chiaro',
        dark: 'Scuro',
        system: 'Sistema'
      },
      footer: {
        tagline: 'Sapori messicani autentici, esperienza moderna.',
        quickLinks: 'Link rapidi',
        contact: 'Contatto',
        newsletter: 'Ottieni 20% di sconto sul tuo primo ordine + offerte esclusive 📧',
        emailPlaceholder: 'Indirizzo email',
        join: 'Unisciti',
        privacy: 'Privacy',
        terms: 'Termini',
        copyright: '© {{year}} {{brand}}. Tutti i diritti riservati.'
      }
    },
    menu: {
      hero: {
        title: 'Esplora il nostro menu',
        subtitle: 'Piatti creati dagli chef, ingredienti freschi e specialità stagionali.'
      },
      actions: {
        searchPlaceholder: 'Cerca piatti…',
        search: 'Cerca',
        sortBy: 'Ordina per',
        sort: {
          popular: 'Più popolari',
          priceLow: 'Prezzo: crescente',
          priceHigh: 'Prezzo: decrescente',
          newest: 'Più recenti'
        },
        add: 'Aggiungi all\'ordine',
        unavailable: 'Non disponibile',
        noItems: 'Nessun articolo trovato.'
      },
      categories: 'Categorie',
      categoriesAll: 'Tutte',
      filters: {
        dietary: 'Preferenze alimentari',
        vegetarian: 'Vegetariano',
        vegan: 'Vegano',
        glutenFree: 'Senza glutine',
        spicy: 'Piccante'
      },
      results: 'Mostrando {{count}} articoli',
      badges: { new: 'Nuovo', popular: 'Popolare' }
    },
    orders: {
      title: 'I miei ordini',
      nav: { mine: 'I miei ordini', track: 'Traccia' },
      table: { order: 'Ordine #', status: 'Stato', total: 'Totale', date: 'Data', actions: 'Azioni' },
      empty: 'Nessun ordine ancora.',
      create: 'Crea ordine',
      trackTitle: 'Traccia ordine',
      trackDesc: 'Inserisci il tuo numero d\'ordine e il codice di tracciamento.',
      trackForm: {
        orderNumber: 'Numero ordine',
        trackingCode: 'Codice di tracciamento',
        placeholderOrder: 'es. 12345',
        placeholderTracking: 'es. ABCD-7890',
        submit: 'Controlla stato'
      },
      detailTitle: 'Ordine #{{orderNumber}}',
      statuses: { pending: 'In attesa', preparing: 'In preparazione', delivering: 'In consegna', completed: 'Completato', cancelled: 'Cancellato' }
    },
    reservations: {
      hero: {
        title: 'Prenota un tavolo',
        subtitle: 'Prenota un tavolo nel nostro ristorante e goditi un\'esperienza culinaria messicana autentica',
        date: 'Data',
        time: 'Ora',
        partySize: 'Numero di persone',
        name: 'Nome',
        email: 'Email',
        phone: 'Telefono',
        notes: 'Note speciali',
        bookNow: 'Prenota ora',
        available: 'Disponibile',
        unavailable: 'Non disponibile',
        selectDate: 'Seleziona data',
        selectTime: 'Seleziona ora',
        selectPartySize: 'Seleziona numero di persone'
      },
      form: {
        required: 'Richiesto',
        invalidEmail: 'Email non valida',
        invalidPhone: 'Numero di telefono non valido',
        minPartySize: 'Minimo: 1 persona',
        maxPartySize: 'Massimo: 20 persone',
        submit: 'Invia prenotazione',
        submitting: 'Invio...',
        success: 'Prenotazione riuscita!',
        error: 'Errore nella prenotazione'
      },
      availability: {
        title: 'Orari disponibili',
        today: 'Oggi',
        tomorrow: 'Domani',
        thisWeek: 'Questa settimana',
        nextWeek: 'Prossima settimana',
        noAvailability: 'Nessun orario disponibile',
        loading: 'Caricamento...'
      },
      confirmation: {
        title: 'Conferma prenotazione',
        message: 'Una conferma sarà inviata alla tua email',
        reference: 'Numero di riferimento',
        date: 'Data',
        time: 'Ora',
        partySize: 'Numero di persone',
        location: 'Posizione',
        contact: 'Informazioni di contatto'
      }
    },
    account: {
      hero: {
        title: 'Il mio account',
        subtitle: 'Gestisci le tue informazioni personali, ordini e prenotazioni',
        welcome: 'Ciao, {{name}}'
      },
      profile: {
        title: 'Profilo',
        personalInfo: 'Informazioni personali',
        contactInfo: 'Informazioni di contatto',
        preferences: 'Preferenze',
        save: 'Salva modifiche',
        saved: 'Salvato',
        saving: 'Salvataggio...'
      },
      orders: {
        title: 'I miei ordini',
        recent: 'Ordini recenti',
        all: 'Tutti gli ordini',
        status: 'Stato',
        date: 'Data',
        total: 'Totale',
        viewDetails: 'Vedi dettagli',
        reorder: 'Riordina',
        track: 'Traccia ordine',
        noOrders: 'Nessun ordine ancora'
      },
      reservations: {
        title: 'Le mie prenotazioni',
        upcoming: 'Prenotazioni imminenti',
        past: 'Prenotazioni passate',
        cancel: 'Cancella prenotazione',
        modify: 'Modifica prenotazione',
        noReservations: 'Nessuna prenotazione'
      },
      settings: {
        title: 'Impostazioni',
        notifications: 'Notifiche',
        language: 'Lingua',
        currency: 'Valuta',
        timezone: 'Fuso orario',
        privacy: 'Privacy',
        security: 'Sicurezza'
      },
      logout: 'Disconnetti',
      deleteAccount: 'Elimina account'
    }
  },
  
  // Portuguese translations
  pt: {
    common: {
      success: 'Sucesso',
      error: 'Erro',
      statusSuccess: 'sucesso',
      statusError: 'erro',
      welcome: 'Bem-vindo',
      loading: 'Carregando...',
      notFound: 'Não encontrado',
      unauthorized: 'Acesso não autorizado',
      forbidden: 'Acesso proibido',
      internalError: 'Erro interno do servidor',
      badRequest: 'Solicitação inválida',
      created: 'Criado com sucesso',
      updated: 'Atualizado com sucesso',
      deleted: 'Excluído com sucesso',
      operationFailed: 'Operação falhou',
      invalidRequest: 'Solicitação inválida',
      resourceNotFound: 'Recurso não encontrado',
      serverError: 'Erro do servidor',
      maintenance: 'O servidor está em manutenção',
      rateLimited: 'Muitas solicitações. Tente novamente mais tarde.',
      timeout: 'Tempo limite da solicitação',
      dataRetrieved: 'Dados recuperados com sucesso',
      languageUpdated: 'Idioma atualizado com sucesso',
      languageReset: 'Idioma redefinido para o padrão com sucesso'
    },
    events: {
      heading: 'Eventos e Catering',
      desc: 'Organizamos eventos especiais e serviços de catering para grandes grupos. Desde aniversários até eventos corporativos.',
      plan: 'Planejar Evento',
      catering: 'Serviço de Catering',
      q1: {
        question: 'Qual é o tamanho mínimo do grupo para eventos?',
        answer: 'Nosso tamanho mínimo de grupo para eventos é de 20 pessoas. Para grupos menores, recomendamos reservas regulares.'
      },
      q2: {
        question: 'Vocês oferecem opções vegetarianas e veganas?',
        answer: 'Sim, temos um menu completo de opções vegetarianas e veganas. Também podemos personalizar menus de acordo com suas necessidades alimentares.'
      }
    },
    faq: {
      heading: 'Perguntas Frequentes',
      q1: {
        question: 'Qual é o seu tempo de entrega?',
        answer: 'Nosso tempo médio de entrega é de 25-35 minutos. Usamos rastreamento em tempo real para que você possa ver exatamente quando seu pedido chegará.'
      },
      q2: {
        question: 'Vocês oferecem opções vegetarianas e veganas?',
        answer: 'Sim! Temos uma ampla seleção de pratos vegetarianos e veganos. Nosso menu inclui tacos, bowls e acompanhamentos à base de plantas.'
      },
      q3: {
        question: 'Posso personalizar meu pedido?',
        answer: 'Absolutamente! Você pode personalizar qualquer prato adicionando ou removendo ingredientes. Apenas nos informe suas preferências ao fazer o pedido.'
      }
    },
    popular: {
      heading: 'Popular Esta Semana',
      seeMenu: 'Ver Menu Completo',
      coming: 'Em Breve',
      chefSpecial: 'Especial do Chef {{num}}',
      notify: 'Notifique-me',
      rating: '4,9/5 de mais de 2.400 locais'
    },
    auth: {
      loginSuccess: 'Login realizado com sucesso',
      loginFailed: 'Falha no login',
      logoutSuccess: 'Logout realizado com sucesso',
      registerSuccess: 'Registro realizado com sucesso',
      registerFailed: 'Falha no registro',
      invalidCredentials: 'Credenciais inválidas',
      accountLocked: 'Conta bloqueada',
      accountNotVerified: 'Conta não verificada',
      passwordResetSent: 'Link de redefinição de senha enviado para seu email',
      passwordResetSuccess: 'Redefinição de senha realizada com sucesso',
      passwordResetFailed: 'Falha na redefinição de senha',
      tokenExpired: 'O token expirou',
      tokenInvalid: 'Token inválido',
      accessDenied: 'Acesso negado',
      sessionExpired: 'A sessão expirou',
      emailAlreadyExists: 'O email já existe',
      usernameAlreadyExists: 'O nome de usuário já existe',
      accountCreated: 'Conta criada com sucesso',
      verificationEmailSent: 'Email de verificação enviado',
      emailVerified: 'Email verificado com sucesso',
      invalidVerificationToken: 'Token de verificação inválido'
    },
    api: {
      dataRetrieved: 'Dados recuperados com sucesso',
      dataUpdated: 'Dados atualizados com sucesso',
      dataCreated: 'Dados criados com sucesso',
      dataDeleted: 'Dados excluídos com sucesso',
      noDataFound: 'Nenhum dado encontrado',
      invalidApiKey: 'Chave da API inválida',
      apiKeyExpired: 'A chave da API expirou',
      apiKeyRequired: 'Chave da API necessária',
      quotaExceeded: 'Cota da API excedida',
      methodNotAllowed: 'Método não permitido',
      unsupportedMediaType: 'Tipo de mídia não suportado',
      payloadTooLarge: 'Carga útil muito grande',
      requestEntityTooLarge: 'Entidade da solicitação muito grande',
      contentTypeRequired: 'Cabeçalho Content-Type necessário',
      jsonParseError: 'Formato JSON inválido',
      missingRequiredField: 'Campo obrigatório ausente: {{field}}',
      invalidFieldValue: 'Valor inválido para o campo: {{field}}',
      duplicateEntry: 'Entrada duplicada encontrada',
      constraintViolation: 'Violação de restrição do banco de dados',
      connectionError: 'Erro de conexão com o banco de dados',
      checkApiDocsAction: 'Verifique a URL ou consulte a documentação da API para endpoints válidos.'
    },
    validation: {
      required: '{{field}} é obrigatório',
      email: 'Por favor, insira um endereço de email válido',
      minLength: '{{field}} deve ter pelo menos {{min}} caracteres',
      maxLength: '{{field}} não deve exceder {{max}} caracteres',
      passwordStrength: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
      passwordMatch: 'As senhas não coincidem',
      invalidFormat: 'Formato inválido para {{field}}',
      invalidDate: 'Formato de data inválido',
      futureDateRequired: 'A data deve estar no futuro',
      pastDateRequired: 'A data deve estar no passado',
      invalidPhone: 'Formato de número de telefone inválido',
      invalidUrl: 'Formato de URL inválido',
      numericOnly: '{{field}} deve conter apenas números',
      alphabeticOnly: '{{field}} deve conter apenas letras',
      alphanumericOnly: '{{field}} deve conter apenas letras e números',
      invalidRange: '{{field}} deve estar entre {{min}} e {{max}}',
      fileRequired: 'O arquivo é obrigatório',
      invalidFileType: 'Tipo de arquivo inválido. Tipos permitidos: {{types}}',
      fileSizeExceeded: 'O tamanho do arquivo não deve exceder {{maxSize}}',
      invalidImageFormat: 'Formato de imagem inválido',
      duplicateValue: '{{field}} já existe'
    },
    email: {
      subject: {
        welcome: 'Bem-vindo ao {{appName}}',
        passwordReset: 'Solicitação de redefinição de senha',
        emailVerification: 'Verifique seu endereço de email',
        accountLocked: 'Alerta de segurança da conta',
        loginAlert: 'Novo login detectado'
      },
      greeting: 'Olá {{name}},',
      welcomeMessage: 'Bem-vindo ao {{appName}}! Estamos entusiasmados em tê-lo conosco.',
      passwordResetMessage: 'Você solicitou uma redefinição de senha. Clique no link abaixo para continuar:',
      verificationMessage: 'Por favor, verifique seu endereço de email clicando no link abaixo:',
      accountLockedMessage: 'Sua conta foi temporariamente bloqueada devido a várias tentativas de login mal-sucedidas.',
      loginAlertMessage: 'Detectamos um novo login em sua conta de {{location}} às {{time}}.',
      footer: 'Se você não solicitou isso, ignore este email ou entre em contato com o suporte.',
      buttonText: {
        resetPassword: 'Redefinir senha',
        verifyEmail: 'Verificar email',
        contactSupport: 'Entrar em contato com o suporte'
      },
      expiryNotice: 'Este link expirará em {{hours}} horas.',
      supportContact: 'Se você precisar de ajuda, entre em contato conosco em {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Item do menu criado com sucesso',
        itemUpdated: 'Item do menu atualizado com sucesso',
        itemDeleted: 'Item do menu excluído com sucesso',
        itemNotFound: 'Item do menu não encontrado',
        categoryCreated: 'Categoria do menu criada com sucesso',
        categoryUpdated: 'Categoria do menu atualizada com sucesso',
        categoryDeleted: 'Categoria do menu excluída com sucesso',
        categoryNotFound: 'Categoria do menu não encontrada',
        itemOutOfStock: 'Item do menu fora de estoque',
        invalidPrice: 'Preço inválido especificado',
        duplicateItem: 'O item do menu já existe'
      },
      orders: {
        orderCreated: 'Pedido criado com sucesso',
        orderUpdated: 'Pedido atualizado com sucesso',
        orderCancelled: 'Pedido cancelado com sucesso',
        orderNotFound: 'Pedido não encontrado',
        orderStatusUpdated: 'Status do pedido atualizado com sucesso',
        invalidOrderStatus: 'Status do pedido inválido',
        orderAlreadyCancelled: 'O pedido já está cancelado',
        orderCannotBeCancelled: 'O pedido não pode ser cancelado neste estágio',
        paymentRequired: 'O pagamento é necessário para concluir o pedido',
        insufficientInventory: 'Inventário insuficiente para alguns itens',
        orderTotal: 'Total do pedido: {{amount}}',
        estimatedDelivery: 'Tempo de entrega estimado: {{time}} minutos'
      },
      reservations: {
        reservationCreated: 'Reserva criada com sucesso',
        reservationUpdated: 'Reserva atualizada com sucesso',
        reservationCancelled: 'Reserva cancelada com sucesso',
        reservationNotFound: 'Reserva não encontrada',
        reservationConfirmed: 'Reserva confirmada',
        tableNotAvailable: 'A mesa não está disponível no horário solicitado',
        invalidReservationTime: 'Horário de reserva inválido',
        reservationTooEarly: 'O horário de reserva está muito longe no futuro',
        reservationTooLate: 'O horário de reserva já passou',
        capacityExceeded: 'O tamanho do grupo excede a capacidade da mesa'
      }
    },
    home: {
      hero: {
        badge: 'Novo: programa de recompensas lançado — ganhe pontos em cada pedido',
        title: 'Mexicano autêntico. <primary>Entregue rapidamente.</primary>',
        desc: 'Dos tacos de rua às especialidades cozidas lentamente. Peça em segundos, reserve instantaneamente e acompanhe sua entrega em tempo real — tudo em um lugar.',
        orderNow: 'Peça agora',
        reserve: 'Reserve uma mesa',
        browseMenu: 'Navegue pelo menu completo',
        rating: '4,9/5 de mais de 2.400 clientes locais',
        avgTime: 'Entrega em média abaixo de 35 minutos',
        openNow: 'Aberto agora',
        closedNow: 'Fechado agora',
        eta: 'Chegada estimada ~ {{m}} min',
        card: {
          title: 'Escolha do chef',
          desc: 'Barbacoa cozida lentamente com salsa verde fresca e tortillas quentes.'
        }
      },
      logo: {
        heading: 'Confiado por foodies locais e apresentado em'
      },
      explore: {
        heading: 'Explore o menu',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Bebidas',
        coming: 'Em breve.',
        chefNotes: 'Notas do chef: favorito do público com coentro fresco e limão.',
        viewMore: 'Ver mais'
      },
      loyalty: {
        heading: 'Fidelidade e recompensas',
        membersSave: 'Membros economizam mais',
        points: 'pontos',
        nextAt: 'Próxima recompensa em {{points}}',
        freeDessert: 'Sobremesa grátis',
        join: 'Junte-se ao programa',
        perks: 'Ver benefícios'
      },
      why: {
        heading: 'Por que escolher Cantina',
        faster: { title: 'Mais rápido que os apps', desc: 'Direto da cozinha para sua porta, sem atrasos de terceiros.' },
        fees: { title: 'Taxas transparentes', desc: 'Nenhuma surpresa no checkout.' },
        oneTap: { title: 'Reservas com um toque', desc: 'Disponibilidade em tempo real e confirmações por SMS.' },
        tracking: { title: 'Rastreamento ao vivo', desc: 'Atualizações minuto a minuto.' },
        chef: { title: 'Criado por chefs', desc: 'Ingredientes frescos e menus sazonais.' },
        rewards: { title: 'Recompensas que importam', desc: 'Pontos em cada pedido, benefícios instantâneos.' }
      },
      faq: {
        heading: 'Perguntas frequentes'
      },
      cta: {
        title: 'Pronto para experimentar o autêntico mexicano?',
        desc: 'Junte-se a milhares de clientes satisfeitos que escolhem Cantina por qualidade, velocidade e serviço.',
        socialProof: '2.400+ clientes felizes este mês',
        limited: 'Oferta por tempo limitado',
        start: 'Comece a pedir',
        reserve: 'Reserve mesa',
        endsTonight: 'Termina esta noite à meia-noite'
      },
      offers: {
        heading: 'Ofertas sazonais',
        badge: 'Tempo limitado',
        bundle: 'Pacote Taco Tuesday',
        deal: '2 tacos + bebida — R$ 9,99',
        endsIn: 'Termina em',
        orderBundle: 'Peça o pacote',
        viewDetails: 'Ver detalhes'
      },
      seo: {
        title: 'Cantina Mariachi – Mexicano Autêntico, Experiência Moderna',
        description: 'Peça online em segundos, reserve instantaneamente e acompanhe sua entrega ao vivo.',
        keywords: 'comida mexicana, tacos, entrega, ristorante'
      }
    },
    // Frontend-specific namespaces
    ui: {
      nav: {
        home: 'Início',
        menu: 'Menu',
        orders: 'Pedidos',
        reservations: 'Reservas',
        account: 'Conta',
        profile: 'Perfil',
        login: 'Entrar',
        register: 'Registrar',
        orderNow: 'Peça agora',
      },
      offer: {
        freeDelivery: 'Só hoje: entrega gratuita em pedidos acima de R$ 25',
      },
      topbar: {
        open: 'Aberto agora',
        closed: 'Fechado agora',
        eta: 'Chegada estimada ~ {{mins}} min',
        noSignup: 'Sem necessidade de cadastro',
        browse: 'Navegar pelo menu',
      },
      brand: 'Cantina',
      errors: {
        title: 'Ops!',
        notFound: 'A página solicitada não pôde ser encontrada.',
      },
      a11y: {
        toggleLanguage: 'Alternar idioma',
        toggleTheme: 'Alternar tema',
        close: 'Fechar'
      },
      language: {
        reset: 'Redefinir para padrão',
        select: 'Selecionar idioma',
        current: 'Idioma atual'
      },
      theme: {
        toggle: 'Alternar tema',
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema'
      },
      footer: {
        tagline: 'Sabores mexicanos autênticos, experiência moderna.',
        quickLinks: 'Links rápidos',
        contact: 'Contato',
        newsletter: 'Obtenha 20% de desconto no seu primeiro pedido + ofertas exclusivas 📧',
        emailPlaceholder: 'Endereço de email',
        join: 'Junte-se',
        privacy: 'Privacidade',
        terms: 'Termos',
        copyright: '© {{year}} {{brand}}. Todos os direitos reservados.'
      }
    },
    menu: {
      hero: {
        title: 'Explore nosso menu',
        subtitle: 'Pratos criados por chefs, ingredientes frescos e especialidades sazonais.'
      },
      actions: {
        searchPlaceholder: 'Pesquisar pratos…',
        search: 'Pesquisar',
        sortBy: 'Ordenar por',
        sort: {
          popular: 'Mais populares',
          priceLow: 'Preço: crescente',
          priceHigh: 'Preço: decrescente',
          newest: 'Mais recentes'
        },
        add: 'Adicionar ao pedido',
        unavailable: 'Indisponível',
        noItems: 'Nenhum item encontrado.'
      },
      categories: 'Categorias',
      categoriesAll: 'Todas',
      filters: {
        dietary: 'Preferências alimentares',
        vegetarian: 'Vegetariano',
        vegan: 'Vegano',
        glutenFree: 'Sem glúten',
        spicy: 'Picante'
      },
      results: 'Mostrando {{count}} itens',
      badges: { new: 'Novo', popular: 'Popular' }
    },
    orders: {
      title: 'Meus pedidos',
      nav: { mine: 'Meus pedidos', track: 'Rastrear' },
      table: { order: 'Pedido #', status: 'Status', total: 'Total', date: 'Data', actions: 'Ações' },
      empty: 'Nenhum pedido ainda.',
      create: 'Criar pedido',
      trackTitle: 'Rastrear pedido',
      trackDesc: 'Digite seu número de pedido e código de rastreamento.',
      trackForm: {
        orderNumber: 'Número do pedido',
        trackingCode: 'Código de rastreamento',
        placeholderOrder: 'ex. 12345',
        placeholderTracking: 'ex. ABCD-7890',
        submit: 'Verificar status'
      },
      detailTitle: 'Pedido #{{orderNumber}}',
      statuses: { pending: 'Pendente', preparing: 'Preparando', delivering: 'Entregando', completed: 'Concluído', cancelled: 'Cancelado' }
    },
    reservations: {
      hero: {
        title: 'Reserve uma mesa',
        subtitle: 'Reserve uma mesa em nosso restaurante e desfrute de uma experiência culinária mexicana autêntica',
        date: 'Data',
        time: 'Horário',
        partySize: 'Tamanho do grupo',
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
        notes: 'Notas especiais',
        bookNow: 'Reserve agora',
        available: 'Disponível',
        unavailable: 'Indisponível',
        selectDate: 'Selecionar data',
        selectTime: 'Selecionar horário',
        selectPartySize: 'Selecionar tamanho do grupo'
      },
      form: {
        required: 'Obrigatório',
        invalidEmail: 'Email inválido',
        invalidPhone: 'Número de telefone inválido',
        minPartySize: 'Mínimo: 1 pessoa',
        maxPartySize: 'Máximo: 20 pessoas',
        submit: 'Enviar reserva',
        submitting: 'Enviando...',
        success: 'Reserva bem-sucedida!',
        error: 'Erro ao fazer reserva'
      },
      availability: {
        title: 'Horários disponíveis',
        today: 'Hoje',
        tomorrow: 'Amanhã',
        thisWeek: 'Esta semana',
        nextWeek: 'Próxima semana',
        noAvailability: 'Nenhum horário disponível',
        loading: 'Carregando...'
      },
      confirmation: {
        title: 'Confirmação de reserva',
        message: 'Uma confirmação será enviada para seu email',
        reference: 'Número de referência',
        date: 'Data',
        time: 'Horário',
        partySize: 'Tamanho do grupo',
        location: 'Localização',
        contact: 'Informações de contato'
      }
    },
    account: {
      hero: {
        title: 'Minha conta',
        subtitle: 'Gerencie suas informações pessoais, pedidos e reservas',
        welcome: 'Olá, {{name}}'
      },
      profile: {
        title: 'Perfil',
        personalInfo: 'Informações pessoais',
        contactInfo: 'Informações de contato',
        preferences: 'Preferências',
        save: 'Salvar alterações',
        saved: 'Salvo',
        saving: 'Salvando...'
      },
      orders: {
        title: 'Meus pedidos',
        recent: 'Pedidos recentes',
        all: 'Todos os pedidos',
        status: 'Status',
        date: 'Data',
        total: 'Total',
        viewDetails: 'Ver detalhes',
        reorder: 'Fazer pedido novamente',
        track: 'Rastrear pedido',
        noOrders: 'Nenhum pedido ainda'
      },
      reservations: {
        title: 'Minhas reservas',
        upcoming: 'Reservas futuras',
        past: 'Reservas passadas',
        cancel: 'Cancelar reserva',
        modify: 'Modificar reserva',
        noReservations: 'Nenhuma reserva'
      },
      settings: {
        title: 'Configurações',
        notifications: 'Notificações',
        language: 'Idioma',
        currency: 'Moeda',
        timezone: 'Fuso horário',
        privacy: 'Privacidade',
        security: 'Segurança'
      },
      logout: 'Sair',
      deleteAccount: 'Excluir conta'
    }
  }
};