const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const State = require('../models/State');
const Stay = require('../models/Stay');
const Service = require('../models/Service');

dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const destinations = [
  {
    name: 'Sikkim',
    state: 'Sikkim',
    region: 'northeast',
    description: 'Sikkim is a state in northeastern India, bordered by Bhutan, Tibet, and Nepal. It is known for its biodiversity, including alpine and subtropical climates, as well as being home to Kanchenjunga, the third-highest mountain in the world. The state is famous for its monasteries, pristine lakes, and stunning mountain views.',
    shortDescription: 'Explore the pristine beauty of Sikkim with snow-capped peaks, ancient monasteries, and breathtaking lakes.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    highlights: ['Kanchenjunga Views', 'Tsomgo Lake', 'Nathula Pass', 'Rumtek Monastery', 'MG Marg Gangtok'],
    bestTimeToVisit: 'March to May, October to December',
    howToReach: {
      byAir: 'Bagdogra Airport (IXB) is the nearest airport, 124 km from Gangtok.',
      byTrain: 'New Jalpaiguri (NJP) is the nearest major railway station.',
      byRoad: 'Well connected by road via National Highway 10.'
    },
    thingsToDo: [
      { title: 'Cable Car Ride', description: 'Experience breathtaking views of the valley from Gangtok Ropeway.' },
      { title: 'River Rafting on Teesta', description: 'Enjoy thrilling rapids on the Teesta River.' },
      { title: 'Tsomgo Lake Visit', description: 'Visit the stunning glacial lake at 12,310 feet.' }
    ],
    packageCount: 12,
    isFeatured: true,
    order: 1
  },
  {
    name: 'Rajasthan',
    state: 'Rajasthan',
    region: 'north',
    description: 'Rajasthan, the Land of Kings, is India\'s largest state by area. Famous for its majestic palaces, mighty forts, colorful bazaars, and vast Thar Desert. The state is a vibrant blend of history, culture, and natural beauty that attracts millions of tourists every year.',
    shortDescription: 'Experience royal heritage, majestic forts, and the golden Thar Desert in Rajasthan.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    highlights: ['Jaipur Pink City', 'Udaipur Lake City', 'Jaisalmer Desert Safari', 'Jodhpur Blue City', 'Ranthambore Safari'],
    bestTimeToVisit: 'October to March',
    howToReach: {
      byAir: 'Jaipur International Airport (JAI) is well connected to major cities.',
      byTrain: 'Major railway stations include Jaipur, Jodhpur, and Udaipur.',
      byRoad: 'Excellent road connectivity with neighboring states.'
    },
    thingsToDo: [
      { title: 'Desert Safari', description: 'Experience camel rides and cultural performances in the Thar Desert.' },
      { title: 'Heritage Walk', description: 'Explore the magnificent forts and palaces of Rajasthan.' },
      { title: 'Lake Boat Ride', description: 'Enjoy serene boat rides on Lake Pichola in Udaipur.' }
    ],
    packageCount: 15,
    isFeatured: true,
    order: 2
  },
  {
    name: 'Kerala',
    state: 'Kerala',
    region: 'south',
    description: 'Kerala, known as God\'s Own Country, is a tropical paradise on India\'s southwestern coast. Famous for its backwaters, houseboats, tea plantations, pristine beaches, and rich cultural heritage. The state offers a perfect blend of nature, culture, and wellness.',
    shortDescription: 'Discover God\'s Own Country with backwaters, houseboats, and lush green landscapes.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    highlights: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Kovalam Beach', 'Thekkady Wildlife', 'Kochi Fort'],
    bestTimeToVisit: 'September to March',
    howToReach: {
      byAir: 'Cochin International Airport (COK) and Trivandrum Airport (TRV).',
      byTrain: 'Well connected via Kerala\'s extensive railway network.',
      byRoad: 'National highways connect Kerala to all major South Indian cities.'
    },
    thingsToDo: [
      { title: 'Houseboat Stay', description: 'Float through the serene backwaters of Alleppey on a luxury houseboat.' },
      { title: 'Tea Plantation Tour', description: 'Walk through the misty tea gardens of Munnar.' },
      { title: 'Ayurvedic Wellness', description: 'Rejuvenate with traditional Ayurvedic treatments.' }
    ],
    packageCount: 10,
    isFeatured: true,
    order: 3
  },
  {
    name: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    region: 'north',
    description: 'Himachal Pradesh, the Land of Gods, is a northern Indian state in the Himalayas. Known for its hill stations, adventure sports, temples, and stunning landscapes. From the bustling streets of Manali to the serene valleys of Spiti, Himachal offers something for everyone.',
    shortDescription: 'Experience the majestic Himalayas with hill stations, adventure sports, and ancient temples.',
    image: 'https://images.unsplash.com/photo-1597075244532-50c80e3b448d?w=800',
    highlights: ['Manali', 'Shimla', 'Dharamshala', 'Spiti Valley', 'Rohtang Pass'],
    bestTimeToVisit: 'March to June, December to February for snow',
    howToReach: {
      byAir: 'Chandigarh Airport and Kullu-Manali Airport.',
      byTrain: 'Shimla narrow gauge railway and nearest major station at Chandigarh.',
      byRoad: 'Well connected by road from Delhi and Chandigarh.'
    },
    thingsToDo: [
      { title: 'Skiing in Solang Valley', description: 'Hit the slopes at one of India\'s best skiing destinations.' },
      { title: 'Paragliding in Bir Billing', description: 'Soar above the Dhauladhar range.' },
      { title: 'Trek to Triund', description: 'A scenic trek with panoramic views of the Himalayas.' }
    ],
    packageCount: 12,
    isFeatured: true,
    order: 4
  },
  {
    name: 'Meghalaya',
    state: 'Meghalaya',
    region: 'northeast',
    description: 'Meghalaya, the Abode of Clouds, is a northeastern Indian state known for its living root bridges, waterfalls, caves, and lush green landscapes. It is one of the wettest places on Earth and offers incredible natural beauty and unique cultural experiences.',
    shortDescription: 'Explore the living root bridges, stunning waterfalls, and cave systems of Meghalaya.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    highlights: ['Living Root Bridges', 'Dawki River', 'Cherrapunji', 'Shillong', 'Mawlynnong Village'],
    bestTimeToVisit: 'October to May',
    howToReach: {
      byAir: 'Shillong Airport (UMR) is the nearest airport.',
      byTrain: 'Guwahati Railway Station is the nearest major station.',
      byRoad: 'Well connected via road from Guwahati (3 hours).'
    },
    thingsToDo: [
      { title: 'Trek to Double Decker Root Bridge', description: 'A challenging trek to see the famous living root bridge.' },
      { title: 'Boat Ride at Dawki', description: 'Crystal clear waters of the Umngot River.' },
      { title: 'Explore Mawsmai Cave', description: 'Discover the stunning limestone formations.' }
    ],
    packageCount: 8,
    isFeatured: true,
    order: 5
  },
  {
    name: 'Uttarakhand',
    state: 'Uttarakhand',
    region: 'north',
    description: 'Uttarakhand, the Devbhumi (Land of Gods), is a Himalayan state known for its Hindu pilgrimage sites, hill stations, and biodiversity. From the holy cities of Haridwar and Rishikesh to the scenic beauty of Nainital and Jim Corbett, Uttarakhand is a traveler\'s paradise.',
    shortDescription: 'Visit the holy temples, adventure capital, and pristine hill stations of Uttarakhand.',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800',
    highlights: ['Rishikesh', 'Nainital', 'Jim Corbett', 'Mussoorie', 'Valley of Flowers'],
    bestTimeToVisit: 'March to June, September to November',
    howToReach: {
      byAir: 'Jolly Grant Airport (DED) in Dehradun.',
      byTrain: 'Dehradun and Haridwar are major railway stations.',
      byRoad: 'Well connected to Delhi via NH-58.'
    },
    thingsToDo: [
      { title: 'River Rafting in Rishikesh', description: 'Experience world-class white water rafting on the Ganges.' },
      { title: 'Jungle Safari in Jim Corbett', description: 'Spot tigers and other wildlife in India\'s oldest national park.' },
      { title: 'Trek to Valley of Flowers', description: 'A UNESCO World Heritage trek through alpine meadows.' }
    ],
    packageCount: 10,
    isFeatured: true,
    order: 6
  }
];

const packages = [
  {
    title: 'Zuluk Silk Route Adventure',
    destinationIndex: 0,
    duration: { nights: 3, days: 4 },
    description: 'Experience the ancient Silk Route through Zuluk, Nathang Valley, and Reshikhola. This thrilling journey takes you through winding roads, ancient villages, and breathtaking Himalayan landscapes. Witness the famous sunrise over Kanchenjunga and explore the pristine beauty of East Sikkim.',
    shortDescription: 'Journey through the ancient Silk Route with stunning Himalayan views.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    price: { actual: 12999, discounted: 8999 },
    inclusions: ['Accommodation', 'Breakfast', 'Transport', 'Permits', 'Sightseeing'],
    exclusions: ['Flights', 'Lunch', 'Dinner', 'Personal Expenses', 'Tips'],
    itinerary: [
      { day: 1, title: 'Gangtok to Zuluk', description: 'Drive from Gangtok to Zuluk via the Silk Route.', activities: ['Scenic Drive', 'Zuluk Village Visit'], meals: ['Dinner'], accommodation: 'Homestay in Zuluk' },
      { day: 2, title: 'Zuluk to Nathang Valley', description: 'Explore Nathang Valley and visit the Thambi View Point.', activities: ['Sunrise View', 'Thambi View Point'], meals: ['Breakfast', 'Dinner'], accommodation: 'Homestay in Nathang' },
      { day: 3, title: 'Nathang to Reshikhola', description: 'Drive to Reshikhola and enjoy the riverside.', activities: ['River Side Walk', 'Bonfire'], meals: ['Breakfast', 'Dinner'], accommodation: 'Homestay in Reshikhola' },
      { day: 4, title: 'Reshikhola to Gangtok', description: 'Return to Gangtok with memories.', activities: ['Scenic Drive'], meals: ['Breakfast'], accommodation: '' }
    ],
    highlights: ['Silk Route Experience', 'Kanchenjunga Sunrise', 'Ancient Villages', 'Mountain Views'],
    places: ['Zuluk', 'Nathang Valley', 'Reshikhola'],
    themes: ['adventure', 'trekking'],
    rating: { average: 4.5, count: 120 },
    featured: true,
    popular: true
  },
  {
    title: 'Darjeeling Gangtok Tour Package',
    destinationIndex: 0,
    duration: { nights: 4, days: 5 },
    description: 'Explore the best of Eastern Himalayas with this curated package covering Gangtok and Darjeeling. From the bustling MG Marg to the serene tea gardens of Darjeeling, experience the perfect blend of mountain culture and natural beauty.',
    shortDescription: 'Best of Eastern Himalayas covering Gangtok and Darjeeling.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    price: { actual: 18999, discounted: 14999 },
    inclusions: ['Accommodation', 'Breakfast & Dinner', 'Transport', 'Sightseeing', 'Permits'],
    exclusions: ['Flights', 'Lunch', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in Gangtok', description: 'Arrive and transfer to hotel. Evening free at MG Marg.', activities: ['Airport Transfer', 'MG Marg Walk'], meals: ['Dinner'], accommodation: 'Hotel in Gangtok' },
      { day: 2, title: 'Gangtok Sightseeing', description: 'Full day Gangtok city tour.', activities: ['Tsomgo Lake', 'Baba Mandir', 'Rumtek Monastery'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Gangtok' },
      { day: 3, title: 'Gangtok to Darjeeling', description: 'Drive to Darjeeling.', activities: ['Scenic Drive'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Darjeeling' },
      { day: 4, title: 'Darjeeling Sightseeing', description: 'Full day Darjeeling tour.', activities: ['Tiger Hill Sunrise', 'Batasia Loop', 'Tea Garden'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Darjeeling' },
      { day: 5, title: 'Departure', description: 'Transfer to NJP/Bagdogra for onward journey.', activities: ['Airport Transfer'], meals: ['Breakfast'], accommodation: '' }
    ],
    highlights: ['Tiger Hill Sunrise', 'Tsomgo Lake', 'Tea Gardens', 'MG Marg'],
    places: ['Gangtok', 'Darjeeling'],
    themes: ['family', 'honeymoon', 'culture-heritage'],
    rating: { average: 4.3, count: 95 },
    featured: true,
    popular: true
  },
  {
    title: 'Royal Rajasthan Heritage Tour',
    destinationIndex: 1,
    duration: { nights: 6, days: 7 },
    description: 'Immerse yourself in the royal heritage of Rajasthan with this comprehensive tour covering Jaipur, Udaipur, Jodhpur, and Jaisalmer. Experience magnificent forts, palaces, desert safaris, and the vibrant culture of the Land of Kings.',
    shortDescription: 'Explore the royal heritage of Jaipur, Udaipur, Jodhpur, and Jaisalmer.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    price: { actual: 35999, discounted: 28999 },
    inclusions: ['Accommodation', 'Breakfast', 'Transport', 'Sightseeing', 'Desert Safari'],
    exclusions: ['Flights', 'Lunch', 'Dinner', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in Jaipur', description: 'Arrive and transfer to hotel.', activities: ['Airport Transfer', 'City Palace Visit'], meals: ['Dinner'], accommodation: 'Heritage Hotel in Jaipur' },
      { day: 2, title: 'Jaipur Sightseeing', description: 'Full day Jaipur tour.', activities: ['Amber Fort', 'Hawa Mahal', 'Jantar Mantar'], meals: ['Breakfast'], accommodation: 'Heritage Hotel in Jaipur' },
      { day: 3, title: 'Jaipur to Jodhpur', description: 'Drive to Jodhpur.', activities: ['Mehrangarh Fort', 'Clock Tower'], meals: ['Breakfast'], accommodation: 'Hotel in Jodhpur' },
      { day: 4, title: 'Jodhpur to Jaisalmer', description: 'Drive to Jaisalmer.', activities: ['Desert Safari', 'Camel Ride'], meals: ['Breakfast', 'Dinner'], accommodation: 'Desert Camp' },
      { day: 5, title: 'Jaisalmer Sightseeing', description: 'Explore Jaisalmer.', activities: ['Jaisalmer Fort', 'Patwon Ki Haveli'], meals: ['Breakfast'], accommodation: 'Hotel in Jaisalmer' },
      { day: 6, title: 'Jaisalmer to Udaipur', description: 'Drive to Udaipur.', activities: ['Lake Pichola Boat Ride'], meals: ['Breakfast'], accommodation: 'Hotel in Udaipur' },
      { day: 7, title: 'Udaipur Sightseeing & Departure', description: 'Udaipur tour and departure.', activities: ['City Palace', 'Jagdish Temple'], meals: ['Breakfast'], accommodation: '' }
    ],
    highlights: ['Amber Fort', 'Desert Safari', 'Lake Pichola', 'Mehrangarh Fort'],
    places: ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'],
    themes: ['culture-heritage', 'family', 'honeymoon'],
    rating: { average: 4.7, count: 200 },
    featured: true,
    popular: true
  },
  {
    title: 'Kerala Backwaters & Hill Station Tour',
    destinationIndex: 2,
    duration: { nights: 5, days: 6 },
    description: 'Experience the best of Kerala with a houseboat stay in Alleppey backwaters and a hill station retreat in Munnar. From serene waterways to misty tea gardens, this package captures the essence of God\'s Own Country.',
    shortDescription: 'Houseboat experience in Alleppey and tea gardens of Munnar.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    price: { actual: 25999, discounted: 19999 },
    inclusions: ['Accommodation', 'Houseboat Stay', 'Breakfast & Dinner', 'Transport', 'Sightseeing'],
    exclusions: ['Flights', 'Lunch', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in Kochi', description: 'Arrive and transfer to hotel.', activities: ['Airport Transfer', 'Fort Kochi Walk'], meals: ['Dinner'], accommodation: 'Hotel in Kochi' },
      { day: 2, title: 'Kochi to Alleppey', description: 'Drive to Alleppey and board houseboat.', activities: ['Houseboat Check-in', 'Backwater Cruise'], meals: ['Lunch', 'Dinner'], accommodation: 'Houseboat' },
      { day: 3, title: 'Alleppey to Munnar', description: 'Disembark and drive to Munnar.', activities: ['Tea Museum Visit'], meals: ['Breakfast', 'Dinner'], accommodation: 'Resort in Munnar' },
      { day: 4, title: 'Munnar Sightseeing', description: 'Full day Munnar tour.', activities: ['Eravikulam National Park', 'Tea Plantation Walk'], meals: ['Breakfast', 'Dinner'], accommodation: 'Resort in Munnar' },
      { day: 5, title: 'Munnar to Thekkady', description: 'Drive to Thekkady.', activities: ['Periyar Wildlife Sanctuary'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Thekkady' },
      { day: 6, title: 'Thekkady to Kochi & Departure', description: 'Transfer to airport.', activities: ['Airport Transfer'], meals: ['Breakfast'], accommodation: '' }
    ],
    highlights: ['Houseboat Stay', 'Tea Plantations', 'Periyar Wildlife', 'Backwaters'],
    places: ['Alleppey', 'Munnar', 'Thekkady', 'Kochi'],
    themes: ['honeymoon', 'family', 'luxury'],
    rating: { average: 4.6, count: 150 },
    featured: true,
    popular: true
  },
  {
    title: 'Manali Shimla Adventure Tour',
    destinationIndex: 3,
    duration: { nights: 4, days: 5 },
    description: 'An adrenaline-pumping adventure through Himachal Pradesh covering Manali and Shimla. Experience paragliding, river rafting, skiing, and more amidst the stunning Himalayan backdrop.',
    shortDescription: 'Adventure activities in Manali and Shimla with stunning mountain views.',
    image: 'https://images.unsplash.com/photo-1597075244532-50c80e3b448d?w=800',
    price: { actual: 22999, discounted: 17999 },
    inclusions: ['Accommodation', 'Breakfast & Dinner', 'Transport', 'Adventure Activities', 'Sightseeing'],
    exclusions: ['Flights', 'Lunch', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in Manali', description: 'Transfer and explore Mall Road.', activities: ['Airport Transfer', 'Mall Road Walk'], meals: ['Dinner'], accommodation: 'Hotel in Manali' },
      { day: 2, title: 'Manali Adventure Day', description: 'Full day adventure activities.', activities: ['Paragliding', 'River Rafting', 'Solang Valley'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Manali' },
      { day: 3, title: 'Manali to Shimla', description: 'Scenic drive to Shimla.', activities: ['Atal Tunnel', 'Kufri Visit'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Shimla' },
      { day: 4, title: 'Shimla Sightseeing', description: 'Full day Shimla tour.', activities: ['Jakhoo Temple', 'Mall Road', 'Christ Church'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Shimla' },
      { day: 5, title: 'Departure', description: 'Transfer to Chandigarh airport.', activities: ['Airport Transfer'], meals: ['Breakfast'], accommodation: '' }
    ],
    highlights: ['Paragliding', 'River Rafting', 'Atal Tunnel', 'Solang Valley'],
    places: ['Manali', 'Shimla', 'Kufri'],
    themes: ['adventure', 'family', 'group'],
    rating: { average: 4.4, count: 80 },
    featured: true,
    popular: true
  },
  {
    title: 'Meghalaya Explorer Tour',
    destinationIndex: 4,
    duration: { nights: 5, days: 6 },
    description: 'Discover the enchanting beauty of Meghalaya with its living root bridges, crystal clear rivers, stunning waterfalls, and unique tribal culture. This tour covers Shillong, Cherrapunji, Dawki, and Mawlynnong.',
    shortDescription: 'Explore living root bridges, Dawki river, and Meghalaya\'s natural wonders.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    price: { actual: 24999, discounted: 19999 },
    inclusions: ['Accommodation', 'Breakfast & Dinner', 'Transport', 'Sightseeing', 'Guide'],
    exclusions: ['Flights', 'Lunch', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival in Shillong', description: 'Transfer and explore local markets.', activities: ['Airport Transfer', 'Police Bazaar'], meals: ['Dinner'], accommodation: 'Hotel in Shillong' },
      { day: 2, title: 'Shillong to Cherrapunji', description: 'Drive to Cherrapunji.', activities: ['Nohkalikai Falls', 'Mawsmai Cave'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Cherrapunji' },
      { day: 3, title: 'Cherrapunji Sightseeing', description: 'Full day Cherrapunji tour.', activities: ['Living Root Bridge Trek', 'Double Decker Bridge'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Cherrapunji' },
      { day: 4, title: 'Cherrapunji to Dawki', description: 'Drive to Dawki.', activities: ['Dawki River Boating', 'Mawlynnong Village'], meals: ['Breakfast', 'Dinner'], accommodation: 'Homestay' },
      { day: 5, title: 'Dawki to Shillong', description: 'Return to Shillong.', activities: ['Ward\'s Lake', 'Don Bosco Museum'], meals: ['Breakfast', 'Dinner'], accommodation: 'Hotel in Shillong' },
      { day: 6, title: 'Departure', description: 'Transfer to airport.', activities: ['Airport Transfer'], meals: ['Breakfast'], accommodation: '' }
    ],
    highlights: ['Living Root Bridge', 'Dawki River', 'Nohkalikai Falls', 'Mawlynnong Village'],
    places: ['Shillong', 'Cherrapunji', 'Dawki', 'Mawlynnong'],
    themes: ['adventure', 'trekking', 'culture-heritage'],
    rating: { average: 4.5, count: 65 },
    featured: true,
    popular: true
  }
];

const blogs = [
  {
    title: '10 Best Holiday Destinations to Visit in July in India',
    content: 'July marks the beginning of the monsoon season in India, transforming the landscape into a lush green paradise. Here are the top 10 destinations to visit this July...',
    excerpt: 'Discover the best places to visit in India during July monsoon season.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category: 'travel-tips',
    tags: ['monsoon', 'india', 'july', 'travel-guide'],
    isPublished: true
  },
  {
    title: 'How to Plan a Budget Trip to Rajasthan',
    content: 'Rajasthan doesn\'t have to be expensive. With careful planning, you can explore the royal state without breaking the bank...',
    excerpt: 'Tips and tricks for planning an affordable Rajasthan trip.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    category: 'budget-travel',
    tags: ['rajasthan', 'budget', 'travel-tips'],
    isPublished: true
  },
  {
    title: 'Ultimate Guide to Kerala Backwaters',
    content: 'The backwaters of Kerala are a network of lagoons, lakes, and canals parallel to the Arabian Sea coast...',
    excerpt: 'Everything you need to know about experiencing Kerala backwaters.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    category: 'destination-guide',
    tags: ['kerala', 'backwaters', 'houseboat'],
    isPublished: true
  },
  {
    title: 'Best Hill Stations in India to Visit in 2024',
    content: 'Escape the summer heat by visiting these stunning hill stations across India...',
    excerpt: 'Top hill stations for a perfect summer getaway.',
    image: 'https://images.unsplash.com/photo-1597075244532-50c80e3b448d?w=800',
    category: 'destination-guide',
    tags: ['hill-stations', 'summer', 'india'],
    isPublished: true
  }
];

const reviews = [
  { name: 'Priya Sharma', email: 'priya@example.com', rating: 5, title: 'Amazing Sikkim Trip!', comment: 'Had an incredible time in Sikkim. The itinerary was well planned and the hotels were great. Will definitely book again with Pleasant Yatra.', isApproved: true, isVerified: true },
  { name: 'Rahul Verma', email: 'rahul@example.com', rating: 4, title: 'Great Rajasthan Experience', comment: 'Loved the royal heritage tour. The desert safari was the highlight. Minor delays in transfers but overall excellent experience.', isApproved: true, isVerified: true },
  { name: 'Anita Patel', email: 'anita@example.com', rating: 5, title: 'Perfect Kerala Honeymoon', comment: 'The houseboat stay was magical! Everything was perfectly arranged. Special thanks to our travel coordinator.', isApproved: true, isVerified: true },
  { name: 'Vikram Singh', email: 'vikram@example.com', rating: 5, title: 'Best Adventure Trip', comment: 'The Manali adventure tour exceeded expectations. Paragliding and river rafting were thrilling. Hotels were comfortable.', isApproved: true, isVerified: true },
  { name: 'Meera Joshi', email: 'meera@example.com', rating: 4, title: 'Wonderful Meghalaya Tour', comment: 'Meghalaya was beautiful! The living root bridge trek was challenging but worth it. Food was great too.', isApproved: true, isVerified: true }
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const states = [
  { name: 'Sikkim', slug: 'sikkim', region: 'northeast', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', order: 1 },
  { name: 'Rajasthan', slug: 'rajasthan', region: 'north', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', order: 2 },
  { name: 'Kerala', slug: 'kerala', region: 'south', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', order: 3 },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', region: 'north', image: 'https://images.unsplash.com/photo-1597075244532-50c80e3b448d?w=800', order: 4 },
  { name: 'Meghalaya', slug: 'meghalaya', region: 'northeast', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', order: 5 },
  { name: 'Uttarakhand', slug: 'uttarakhand', region: 'north', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800', order: 6 }
];

const stays = [
  { name: 'Summit Norling Resort & Spa', slug: 'summit-norling-resort-spa-gangtok', city: 'Gangtok', state: 'Sikkim', type: 'resort', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', price: { amount: 6500 }, rating: { average: 4.4, count: 320 }, amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Mountain View'], featured: true, destinationIndex: 0 },
  { name: 'Hotel Golden Sunrise and Spa', slug: 'hotel-golden-sunrise-and-spa-pelling', city: 'Pelling', state: 'Sikkim', type: 'hotel', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', price: { amount: 4200 }, rating: { average: 4.2, count: 180 }, amenities: ['Free WiFi', 'Breakfast', 'Spa'], destinationIndex: 0 },
  { name: 'The Elgin Nor-Khill', slug: 'the-elgin-nor-khill-gangtok', city: 'Gangtok', state: 'Sikkim', type: 'hotel', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', price: { amount: 12000 }, rating: { average: 4.7, count: 410 }, amenities: ['Luxury', 'Heritage', 'Restaurant', 'Bar'], featured: true, destinationIndex: 0 },
  { name: 'The Elgin', slug: 'the-elgin-darjeeling', city: 'Darjeeling', state: 'West Bengal', type: 'hotel', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', price: { amount: 9800 }, rating: { average: 4.6, count: 360 }, amenities: ['Heritage', 'Restaurant', 'Garden View'], destinationIndex: 0 }
];

const services = [
  {
    title: 'Visa Assistance',
    icon: 'passport',
    category: 'Travel Documentation',
    shortDescription: 'End-to-end visa guidance for destinations across the world with document verification and embassy appointment support.',
    description: 'Planning an international trip? Our visa experts handle everything from documentation, form filling, and embassy appointments to tracking your application. Whether it is a tourist, business, or student visa, we ensure a smooth and stress-free process for you.',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
    highlights: ['Document checklist & review', 'Application form filling', 'Embassy appointment booking', 'Application tracking'],
    includes: ['Visa consultation', 'Document verification', 'Application support', 'Status updates'],
    documentsRequired: ['Valid passport', 'Passport size photographs', 'Proof of travel itinerary', 'Financial documents'],
    turnaroundTime: '5-15 working days',
    price: { amount: 2999, note: 'starting from', perPerson: true },
    processSteps: [
      { title: 'Share Your Details', description: 'Tell us your travel plans and destination.' },
      { title: 'Document Check', description: 'Our experts verify all your documents.' },
      { title: 'Application Submission', description: 'We fill and submit the application on your behalf.' },
      { title: 'Visa Delivery', description: 'Receive your approved visa on time.' }
    ],
    faqs: [
      { question: 'Which countries do you cover?', answer: 'We assist with visa applications for over 40 countries including Schengen, UK, USA, Canada, UAE, and Southeast Asia.' },
      { question: 'How long does the process take?', answer: 'Processing time varies by country, typically between 5 to 15 working days.' }
    ],
    featured: true,
    order: 1
  },
  {
    title: 'Air Ticket Booking',
    icon: 'plane',
    category: 'Ticketing',
    shortDescription: 'Best-in-market fares for domestic and international flights with instant confirmation and 24x7 support.',
    description: 'Get the best airfares for domestic and international routes. Our ticketing desk compares live fares across airlines to find you the cheapest option, with instant confirmation, seat preferences, and round-the-clock support for any changes or cancellations.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    highlights: ['Live fare comparison', 'Instant confirmation', 'Group booking discounts', '24x7 change & cancellation support'],
    includes: ['Flight search & booking', 'Seat & meal preferences', 'E-ticket on email', 'Reissue & cancellation help'],
    documentsRequired: ['Valid ID proof', 'Passport for international travel'],
    turnaroundTime: 'Instant',
    price: { amount: 0, note: 'Best fares on request', perPerson: true },
    processSteps: [
      { title: 'Share Route & Dates', description: 'Tell us your travel route and preferred dates.' },
      { title: 'Get Best Fares', description: 'We send you the cheapest live options.' },
      { title: 'Confirm Booking', description: 'Confirm your choice and share traveller details.' },
      { title: 'Receive Tickets', description: 'Get e-tickets instantly on email & WhatsApp.' }
    ],
    faqs: [
      { question: 'Do you offer refunds on cancellations?', answer: 'Refunds follow the airline policy for your fare class. We assist with cancellations and reissuance at no extra cost.' },
      { question: 'Can you book group flights?', answer: 'Yes, we offer special group fares for 10+ travellers on both domestic and international routes.' }
    ],
    featured: true,
    order: 2
  },
  {
    title: 'Hotel & Resort Booking',
    icon: 'hotel',
    category: 'Accommodation',
    shortDescription: 'Handpicked stays from budget to luxury with exclusive partner rates and flexible booking options.',
    description: 'Whether you need a cozy homestay or a 5-star resort, we book hotels at exclusive partner rates. Our team handpicks every property for comfort and location, and manages check-in support and special requests like early check-in or airport transfers.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    highlights: ['Exclusive partner rates', 'Verified & handpicked properties', 'Flexible cancellation options', 'Special requests handled'],
    includes: ['Room booking', 'Special rates & offers', 'Check-in assistance', 'Cancellation management'],
    documentsRequired: ['Valid ID proof'],
    turnaroundTime: 'Instant',
    price: { amount: 0, note: 'On request', perPerson: false },
    processSteps: [
      { title: 'Share Requirements', description: 'City, dates, budget and preferred type of stay.' },
      { title: 'Get Property Options', description: 'Receive handpicked options with photos & rates.' },
      { title: 'Confirm Booking', description: 'Confirm and share traveller details.' },
      { title: 'Stay Confirmed', description: 'Get booking voucher on email & WhatsApp.' }
    ],
    faqs: [
      { question: 'Do you have special corporate rates?', answer: 'Yes, we offer corporate and bulk-booking rates. Share your requirements for a custom quote.' }
    ],
    featured: true,
    order: 3
  },
  {
    title: 'Cab & Vehicle Rental',
    icon: 'car',
    category: 'Transport',
    shortDescription: 'Airport transfers, local sightseeing and outstation cabs with professional drivers at transparent pricing.',
    description: 'Travel comfortably with our fleet of sedan, SUV and tempo traveller cabs. Book airport pickups, point-to-point trips, or full-day sightseeing with experienced drivers, transparent pricing and round-the-clock support.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    highlights: ['Trained professional drivers', 'Transparent pricing', 'All-India coverage', '24x7 on-road support'],
    includes: ['Cab booking', 'Sightseeing packages', 'Airport transfers', 'Long-term rentals'],
    documentsRequired: ['Valid ID proof'],
    turnaroundTime: 'Instant',
    price: { amount: 0, note: 'Starting ₹8/km', perPerson: false },
    processSteps: [
      { title: 'Share Trip Details', description: 'Route, dates and cab preference.' },
      { title: 'Get Fare Quote', description: 'Receive a transparent price quote.' },
      { title: 'Confirm Booking', description: 'Confirm and share pickup details.' },
      { title: 'Enjoy the Ride', description: 'Your cab arrives on time with a professional driver.' }
    ],
    faqs: [
      { question: 'Do cabs include a driver?', answer: 'Yes, all our cabs come with an experienced, licensed driver. Self-drive options are available on request.' }
    ],
    order: 4
  },
  {
    title: 'Travel Insurance',
    icon: 'shield',
    category: 'Insurance',
    shortDescription: 'Comprehensive travel protection for medical emergencies, trip cancellations, baggage loss and more.',
    description: 'Protect your journey with comprehensive travel insurance. Cover medical emergencies, trip cancellation, flight delays, baggage loss and personal liability — with instant policy issuance and easy claim assistance.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    highlights: ['Medical & emergency coverage', 'Trip cancellation cover', 'Baggage & delay protection', 'Instant policy issuance'],
    includes: ['Policy issuance', 'Claim assistance', 'Pre-trip consultation', 'Emergency assistance'],
    documentsRequired: ['Passport copy', 'Travel dates'],
    turnaroundTime: 'Same day',
    price: { amount: 0, note: 'Starts at ₹150', perPerson: true },
    processSteps: [
      { title: 'Share Trip Plan', description: 'Destination, dates and number of travellers.' },
      { title: 'Choose a Plan', description: 'Select the coverage that fits your trip.' },
      { title: 'Get Insured', description: 'Receive your policy instantly.' },
      { title: 'Travel Protected', description: 'Travel with complete peace of mind.' }
    ],
    faqs: [
      { question: 'What does travel insurance cover?', answer: 'Coverage includes medical emergencies, trip cancellation, flight delays, lost baggage, and personal liability depending on your plan.' }
    ],
    order: 5
  },
  {
    title: 'Forex & Currency Exchange',
    icon: 'money',
    category: 'Finance',
    shortDescription: 'Competitive exchange rates for foreign currency with doorstep delivery across India.',
    description: 'Get foreign currency at the best exchange rates with doorstep delivery. We also provide forex cards and remittance services for students and travellers, ensuring you never run out of cash abroad.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    highlights: ['Best exchange rates', 'Doorstep delivery', 'Forex cards available', 'Buy-back guarantee'],
    includes: ['Currency exchange', 'Forex card issuance', 'Travel card top-ups', 'Remittance support'],
    documentsRequired: ['Valid ID proof', 'Passport & visa (for forex)'],
    turnaroundTime: '24 hours',
    price: { amount: 0, note: 'Best rates on request', perPerson: false },
    processSteps: [
      { title: 'Request Currency', description: 'Share currency and amount needed.' },
      { title: 'Get Best Rates', description: 'We share live competitive rates.' },
      { title: 'Place Order', description: 'Confirm and upload your documents.' },
      { title: 'Doorstep Delivery', description: 'Currency delivered safely to your address.' }
    ],
    faqs: [
      { question: 'Do you buy back unused currency?', answer: 'Yes, we offer buy-back of unused foreign currency at competitive rates with valid receipts.' }
    ],
    order: 6
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check for --destroy flag
    if (process.argv.includes('--destroy')) {
      await User.deleteMany({});
      await Destination.deleteMany({});
      await Package.deleteMany({});
      await Blog.deleteMany({});
      await Review.deleteMany({});
      await State.deleteMany({});
      await Stay.deleteMany({});
      await Service.deleteMany({});
      console.log('Database cleared');
      process.exit(0);
    }

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Package.deleteMany({});
    await Blog.deleteMany({});
    await Review.deleteMany({});
    await State.deleteMany({});
    await Stay.deleteMany({});
    await Service.deleteMany({});

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@pleasantryatra.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created');

    // Create states
    const createdStates = await State.insertMany(states);
    console.log(`${createdStates.length} states created`);

    // Create destinations
    const createdDestinations = await Destination.insertMany(
      destinations.map((d) => {
        const st = createdStates.find((s) => s.name === d.state);
        return { ...d, slug: slugify(d.name), stateRef: st ? st._id : undefined };
      })
    );
    console.log(`${createdDestinations.length} destinations created`);

    // Create packages with correct destination references
    const createdPackages = await Package.insertMany(
      packages.map(pkg => ({
        ...pkg,
        slug: slugify(pkg.title),
        destination: createdDestinations[pkg.destinationIndex]._id
      }))
    );
    console.log(`${createdPackages.length} packages created`);

    // Update destination package counts
    for (const dest of createdDestinations) {
      const count = createdPackages.filter(
        p => p.destination.toString() === dest._id.toString()
      ).length;
      await Destination.findByIdAndUpdate(dest._id, { packageCount: count });
    }

    // Create stays
    const createdStays = await Stay.insertMany(
      stays.map(s => {
        const dest = createdDestinations[s.destinationIndex];
        return { ...s, destination: dest ? dest._id : undefined };
      })
    );
    console.log(`${createdStays.length} stays created`);

    // Create blogs
    await Blog.insertMany(blogs.map((b) => ({ ...b, slug: slugify(b.title) })));
    console.log(`${blogs.length} blogs created`);

    // Create reviews
    const createdReviews = await Review.insertMany(
      reviews.map((review, i) => ({
        ...review,
        package: createdPackages[i % createdPackages.length]._id
      }))
    );
    console.log(`${createdReviews.length} reviews created`);

    // Create services
    const createdServices = await Service.insertMany(
      services.map((s) => ({ ...s, slug: slugify(s.title) }))
    );
    console.log(`${createdServices.length} services created`);

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@pleasantryatra.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
