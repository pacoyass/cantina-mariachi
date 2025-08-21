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
      timeout: 'Request timeout'
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
        heading: 'Frequently asked questions'
      },
      cta: {
        title: 'Ready to experience authentic Mexican?',
        desc: 'Join thousands of satisfied customers who choose Cantina for quality, speed, and service.',
        socialProof: '2,400+ happy customers this month',
        limited: 'Limited time offer',
        start: 'Start Ordering',
        reserve: 'Reserve Table',
        endsTonight: 'Ends tonight at midnight'
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
  // Add other languages here with the same structure...
  ar: {
    // Arabic translations for all namespaces
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
      timeout: 'انتهت مهلة الطلب'
    }
    // ... other Arabic namespaces
  }
  // ... other languages
};