export const uiResources = {
  // Organize by namespace first, then by language (i18next format)
  common: {
    en: {
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
    es: {
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
      maintenance: 'Servidor en mantenimiento',
      rateLimited: 'Demasiadas solicitudes. Inténtalo más tarde.',
      timeout: 'Tiempo de espera agotado',
      dataRetrieved: 'Datos recuperados exitosamente',
      languageUpdated: 'Idioma actualizado exitosamente',
      languageReset: 'Idioma restablecido por defecto exitosamente'
    }
  },
  events: {
    en: {
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
    es: {
      heading: 'Eventos y Catering',
      desc: 'Organizamos eventos especiales y catering para grupos grandes. Desde cumpleaños hasta eventos corporativos.',
      plan: 'Planear Evento',
      catering: 'Servicio de Catering',
      q1: {
        question: '¿Cuál es el tamaño mínimo del grupo para eventos?',
        answer: 'Nuestro tamaño mínimo de grupo para eventos es de 20 personas. Para grupos más pequeños, recomendamos reservas regulares.'
      },
      q2: {
        question: '¿Ofrecen opciones vegetarianas y veganas?',
        answer: 'Sí, tenemos un menú completo de opciones vegetarianas y veganas. También podemos personalizar menús según tus necesidades dietéticas.'
      }
    }
  },
  home: {
    en: {
      hero: {
        badge: 'New: Rewards launch — earn points on every order',
        title: 'Authentic Mexican. <primary>Delivered fast.</primary>',
        desc: 'From street‑style tacos to slow‑cooked specialties. Order in seconds, reserve a table instantly, and track your delivery in real time — all in one place.',
        orderNow: 'Order Now',
        reserve: 'Reserve Table',
        browseMenu: 'Browse Menu',
        rating: '4.9/5 from 2,400+ locals',
        avgTime: '25-35 min avg',
        imageAlt: 'Colorful tacos platter with fresh ingredients and vibrant salsa',
        card: {
          title: "Fresh Daily",
          desc: 'We source ingredients from local markets every morning'
        }
      },
      explore: {
        heading: 'Explore Our Menu',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Drinks',
        coming: 'Coming Soon',
        viewMore: 'View Full Menu',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowls',
          drinks: 'Drinks'
        }
      },
      loyalty: {
        heading: 'Loyalty & Rewards',
        membersSave: 'Members save 10%',
        points: '1,250 points',
        nextAt: 'Next reward at {{points}}',
        freeDessert: 'Free dessert on your birthday',
        join: 'Join Now',
        perks: 'View Perks'
      },
      why: {
        heading: 'Why Choose Cantina Mariachi',
        faster: {
          title: 'Faster than delivery apps',
          desc: 'Direct from our kitchen to your door in 25-35 minutes'
        },
        fees: {
          title: 'No hidden fees',
          desc: 'Transparent pricing with no surprise charges'
        },
        oneTap: {
          title: 'One-tap reordering',
          desc: 'Reorder your favorites with just one tap'
        },
        tracking: {
          title: 'Live order tracking',
          desc: 'See exactly when your food will arrive'
        },
        chef: {
          title: 'Chef-crafted quality',
          desc: 'Every dish prepared by our expert chefs'
        },
        rewards: {
          title: 'Earn rewards',
          desc: 'Get points on every order and unlock exclusive perks'
        }
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
      popular: {
        heading: 'Popular This Week',
        seeMenu: 'See Full Menu',
        coming: 'Coming Soon',
        chefSpecial: 'Chef Special {{num}}',
        notify: 'Notify Me',
        rating: '4.9/5 from 2,400+ locals'
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
      cta: {
        endsTonight: '⚡ Ends Tonight',
        title: 'Limited Time: Taco Tuesday Bundle',
        desc: '2 tacos + drink for just $9.99. Perfect for sharing or keeping all to yourself.',
        socialProof: '🔥 2,400+ orders this week',
        limited: 'Limited Time Offer',
        start: 'Start Ordering',
        reserve: 'Reserve Table'
      },
      sticky: {
        order: 'Order Now',
        reserve: 'Reserve'
      },
      logo: {
        heading: 'Trusted by local businesses and food lovers'
      }
    },
    es: {
      hero: {
        badge: 'Nuevo: Lanzamiento de recompensas — gana puntos en cada pedido',
        title: 'Mexicano auténtico. <primary>Entregado rápido.</primary>',
        desc: 'Desde tacos estilo callejero hasta especialidades cocinadas lentamente. Pide en segundos, reserva una mesa al instante y rastrea tu entrega en tiempo real — todo en un solo lugar.',
        orderNow: 'Ordenar Ahora',
        reserve: 'Reservar Mesa',
        browseMenu: 'Ver Menú',
        rating: '4.9/5 de 2,400+ locales',
        avgTime: '25-35 min promedio',
        imageAlt: 'Plato colorido de tacos con ingredientes frescos y salsa vibrante',
        card: {
          title: 'Fresco Diario',
          desc: 'Obtenemos ingredientes de mercados locales cada mañana'
        }
      },
      explore: {
        heading: 'Explora Nuestro Menú',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Bebidas',
        coming: 'Próximamente',
        viewMore: 'Ver Menú Completo',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowls',
          drinks: 'Bebidas'
        }
      },
      loyalty: {
        heading: 'Lealtad y Recompensas',
        membersSave: 'Los miembros ahorran 10%',
        points: '1,250 puntos',
        nextAt: 'Próxima recompensa en {{points}}',
        freeDessert: 'Postre gratis en tu cumpleaños',
        join: 'Únete Ahora',
        perks: 'Ver Beneficios'
      },
      why: {
        heading: 'Por qué Elegir Cantina Mariachi',
        faster: {
          title: 'Más rápido que las apps de entrega',
          desc: 'Directo de nuestra cocina a tu puerta en 25-35 minutos'
        },
        fees: {
          title: 'Sin cargos ocultos',
          desc: 'Precios transparentes sin cargos sorpresa'
        },
        oneTap: {
          title: 'Reordenar con un toque',
          desc: 'Reordena tus favoritos con solo un toque'
        },
        tracking: {
          title: 'Seguimiento en vivo',
          desc: 'Ve exactamente cuándo llegará tu comida'
        },
        chef: {
          title: 'Calidad de chef',
          desc: 'Cada plato preparado por nuestros chefs expertos'
        },
        rewards: {
          title: 'Gana recompensas',
          desc: 'Obtén puntos en cada pedido y desbloquea beneficios exclusivos'
        }
      },
      values: {
        heading: 'Nuestros Valores y Abastecimiento',
        desc: 'Estamos comprometidos con la calidad, la sostenibilidad y el apoyo a las comunidades locales a través del abastecimiento responsable y prácticas ecológicas.',
        badges: {
          localProduce: 'Productos Locales',
          sustainableSeafood: 'Mariscos Sostenibles',
          fairTrade: 'Comercio Justo',
          lowWaste: 'Bajo Desperdicio'
        },
        cards: {
          dailyMarket: 'Fresco del Mercado Diario',
          houseSalsas: 'Salsas Caseras',
          localTortillas: 'Tortillas Locales',
          compostablePackaging: 'Empaque Compostable'
        }
      },
      value: {
        reorderDesc: 'Reordena tus favoritos en segundos',
        trustedTitle: 'Confiado por más de 10,000 locales',
        trustedDesc: 'Únete a miles de clientes satisfechos'
      },
      how: {
        heading: 'Cómo Funciona',
        desc: 'Ordenar con Cantina Mariachi es simple y rápido',
        step1: {
          title: 'Elige Tus Favoritos',
          desc: 'Navega por nuestro menú y selecciona tus platos favoritos'
        },
        step2: {
          title: 'Haz Tu Pedido',
          desc: 'Personaliza tu pedido y paga de forma segura'
        },
        step3: {
          title: 'Rastrea y Disfruta',
          desc: 'Sigue tu pedido en tiempo real y disfruta comida fresca'
        }
      },
      testimonials: {
        heading: 'Lo Que Dicen Nuestros Clientes'
      },
      popular: {
        heading: 'Popular Esta Semana',
        seeMenu: 'Ver Menú Completo',
        coming: 'Próximamente',
        chefSpecial: 'Especial del Chef {{num}}',
        notify: 'Notifícame',
        rating: '4.9/5 de más de 2,400 locales'
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        q1: {
          question: '¿Cuál es su tiempo de entrega?',
          answer: 'Nuestro tiempo de entrega promedio es de 25-35 minutos. Usamos seguimiento en tiempo real para que puedas ver exactamente cuándo llegará tu pedido.'
        },
        q2: {
          question: '¿Ofrecen opciones vegetarianas y veganas?',
          answer: '¡Sí! Tenemos una amplia selección de platos vegetarianos y veganos. Nuestro menú incluye tacos, bowls y acompañamientos a base de plantas.'
        },
        q3: {
          question: '¿Puedo personalizar mi pedido?',
          answer: '¡Absolutamente! Puedes personalizar cualquier plato agregando o quitando ingredientes. Solo háznoslo saber al ordenar.'
        }
      },
      cta: {
        endsTonight: '⚡ Termina Esta Noche',
        title: 'Tiempo Limitado: Combo Taco Tuesday',
        desc: '2 tacos + bebida por solo $9.99. Perfecto para compartir o quedártelo todo para ti.',
        socialProof: '🔥 Más de 2,400 pedidos esta semana',
        limited: 'Oferta por Tiempo Limitado',
        start: 'Comenzar a Ordenar',
        reserve: 'Reservar Mesa'
      },
      sticky: {
        order: 'Ordenar Ahora',
        reserve: 'Reservar'
      },
      logo: {
        heading: 'Confiado por negocios locales y amantes de la comida'
      }
    }
  }
};