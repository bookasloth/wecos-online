/**
 * Indian districts, used by the onboarding city picker as the searchable long
 * tail behind the five Coffee Club cities.
 *
 * ponytail: broad coverage of India's districts/major cities, not the exact
 * official 780-row census list. Swap this array for the authoritative dataset
 * (or a lookup API) if precise, complete district data ever matters — the
 * picker consumes a flat string[] and won't change.
 */
export const indianDistricts: string[] = [
  // Andhra Pradesh
  "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry",
  "Tirupati", "Kadapa", "Anantapur", "Kakinada", "Eluru", "Ongole", "Chittoor",
  // Arunachal Pradesh
  "Itanagar", "Naharlagun", "Pasighat",
  // Assam
  "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur",
  // Bihar
  "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif",
  "Arrah", "Begusarai", "Katihar", "Chapra", "Munger", "Motihari",
  // Chhattisgarh
  "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur",
  // Goa
  "Panaji", "Margao", "Vasco da Gama", "Mapusa",
  // Gujarat
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar",
  "Junagadh", "Anand", "Nadiad", "Morbi", "Bharuch", "Navsari", "Gandhidham",
  // Haryana
  "Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar",
  "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa",
  // Himachal Pradesh
  "Shimla", "Solan", "Dharamshala", "Mandi", "Kullu", "Bilaspur (HP)",
  // Jharkhand
  "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih",
  // Karnataka
  "Bangalore", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi",
  "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Udupi", "Hassan",
  // Kerala
  "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur",
  "Alappuzha", "Palakkad", "Malappuram", "Kottayam",
  // Madhya Pradesh
  "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna",
  "Ratlam", "Rewa", "Katni", "Singrauli", "Chhindwara",
  // Maharashtra
  "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur",
  "Kolhapur", "Amravati", "Navi Mumbai", "Sangli", "Jalgaon", "Akola", "Latur",
  "Ahmednagar", "Nanded", "Chandrapur", "Satara",
  // Manipur, Meghalaya, Mizoram, Nagaland
  "Imphal", "Shillong", "Aizawl", "Kohima", "Dimapur",
  // Odisha
  "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore",
  // Punjab
  "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur",
  "Pathankot", "Moga", "Firozpur",
  // Rajasthan
  "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar",
  "Sikar", "Bharatpur", "Sri Ganganagar", "Pali",
  // Sikkim
  "Gangtok",
  // Tamil Nadu
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
  "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Nagercoil",
  // Telangana
  "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam",
  // Tripura
  "Agartala",
  // Uttar Pradesh
  "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj",
  "Noida", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Firozabad",
  "Jhansi", "Mathura", "Ayodhya", "Muzaffarnagar",
  // Uttarakhand
  "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Nainital",
  // West Bengal
  "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda",
  "Kharagpur", "Darjeeling",
  // Union Territories
  "Delhi", "New Delhi", "Chandigarh", "Puducherry", "Port Blair", "Srinagar",
  "Jammu", "Leh", "Silvassa", "Daman", "Kavaratti",
];
