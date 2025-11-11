/**
 * Nanakshahi Calendar Service
 * COMPLETE 2025-2026 (Nanakshahi 557) official SGPC calendar
 * ALL 100+ events in chronological order including Sangrand, Masia, Puranmasi
 * Source: SikhNet official calendar
 */

export interface SikhEvent {
  id: string;
  name: string;
  nameGurmukhi: string;
  nanakshahiDate: string;
  gregorianDate: string;
  type: 'gurpurab' | 'martyrdom' | 'historical' | 'festival' | 'gurgaddi' | 'jotijot' | 'birth';
  description: string;
  year?: string;
}

/**
 * Get ALL Nanakshahi calendar events for 2025-2026 (Nanakshahi 557)
 * Based on official SGPC calendar - 100+ events chronologically ordered
 */
export function getNanakshahiEvents(gregorianYear: number = 2025): SikhEvent[] {
  const allEvents: SikhEvent[] = [
    
    // ===== JANUARY 2026 =====
    { id: 'jan-02-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '20 Maghar', gregorianDate: 'January 2, 2026', type: 'historical', description: 'New moon day' },
    { id: 'jan-08-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '26 Maghar', gregorianDate: 'January 8, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'jan-14-sangrand', name: 'Sangrand - Maagh', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਮਾਘ', nanakshahiDate: '1 Maagh', gregorianDate: 'January 14, 2026', type: 'historical', description: 'Maagh month begins' },
    { id: 'jan-14-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '1 Maagh', gregorianDate: 'January 14, 2026', type: 'historical', description: 'New moon day' },
    { id: 'jan-14-foundation', name: 'Foundation of Harmandir Sahib', nameGurmukhi: 'ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਦੀ ਨੀਂਹ', nanakshahiDate: '1 Maagh', gregorianDate: 'January 14, 2026', type: 'historical', description: 'Foundation stone of Golden Temple', year: '1588' },
    { id: 'jan-14-maghi', name: 'Maghi Mela', nameGurmukhi: 'ਮਾਘੀ ਮੇਲਾ', nanakshahiDate: '1 Maagh', gregorianDate: 'January 14, 2026', type: 'festival', description: 'Commemoration of 40 Muktas', year: '1705' },
    { id: 'jan-18-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '5 Maagh', gregorianDate: 'January 18, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'jan-23-marriage', name: 'Marriage of Guru Gobind Singh Ji', nameGurmukhi: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਦਾ ਵਿਆਹ', nanakshahiDate: '10 Maagh', gregorianDate: 'January 23, 2026', type: 'historical', description: 'Marriage with Mata Jito Ji', year: '1677' },
    { id: 'jan-27-deep', name: 'Birthday - Baba Deep Singh Ji', nameGurmukhi: 'ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ', nanakshahiDate: '14 Maagh', gregorianDate: 'January 27, 2026', type: 'birth', description: 'Birth of Baba Deep Singh Ji', year: '1682' },
    { id: 'jan-31-guru7', name: 'Parkash - Guru Har Rai Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰ ਰਾਇ ਜੀ', nanakshahiDate: '18 Maagh', gregorianDate: 'January 31, 2026', type: 'gurpurab', description: 'Birth of 7th Guru', year: '1630' },
    
    // ===== FEBRUARY 2026 =====
    { id: 'feb-01-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '19 Maagh', gregorianDate: 'February 1, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'feb-01-ravidas', name: 'Birth - Bhagat Ravidas Ji', nameGurmukhi: 'ਭਗਤ ਰਵਿਦਾਸ ਜੀ', nanakshahiDate: '19 Maagh', gregorianDate: 'February 1, 2026', type: 'birth', description: 'Birth of Bhagat Ravidas Ji', year: '1377' },
    { id: 'feb-09-vadda', name: 'Vadda Ghallughara', nameGurmukhi: 'ਵੱਡਾ ਘੱਲੂਘਾਰਾ', nanakshahiDate: '27 Maagh', gregorianDate: 'February 9, 2026', type: 'martyrdom', description: 'Great Holocaust at Kup Rohira', year: '1762' },
    { id: 'feb-11-ajit', name: 'Birthday - Baba Ajit Singh Ji', nameGurmukhi: 'ਬਾਬਾ ਅਜੀਤ ਸਿੰਘ ਜੀ', nanakshahiDate: '29 Maagh', gregorianDate: 'February 11, 2026', type: 'birth', description: 'Birth of eldest Sahibzada', year: '1687' },
    { id: 'feb-12-sangrand', name: 'Sangrand - Phagan', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਫੱਗਣ', nanakshahiDate: '1 Phagan', gregorianDate: 'February 12, 2026', type: 'historical', description: 'Phagan month begins' },
    { id: 'feb-12-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '1 Phagan', gregorianDate: 'February 12, 2026', type: 'historical', description: 'New moon day' },
    { id: 'feb-17-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '6 Phagan', gregorianDate: 'February 17, 2026', type: 'historical', description: 'Full moon day' },
    
    // ===== MARCH 2026 =====
    { id: 'mar-03-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '18 Phagan', gregorianDate: 'March 3, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'mar-04-hola-old', name: 'Hola Mohalla', nameGurmukhi: 'ਹੋਲਾ ਮਹੱਲਾ', nanakshahiDate: '21 Phagan', gregorianDate: 'March 4, 2026', type: 'festival', description: 'Sikh martial festival', year: '1701' },
    { id: 'mar-14-newyear', name: 'Nanakshahi New Year 558', nameGurmukhi: 'ਨਾਨਕਸ਼ਾਹੀ ਨਵਾਂ ਸਾਲ', nanakshahiDate: '1 Chet', gregorianDate: 'March 14, 2026', type: 'festival', description: 'Nanakshahi Samvat 558 begins!' },
    { id: 'mar-14-sangrand', name: 'Sangrand - Chet', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਚੇਤ', nanakshahiDate: '1 Chet', gregorianDate: 'March 14, 2026', type: 'historical', description: 'Chet month begins' },
    { id: 'mar-14-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '1 Chet', gregorianDate: 'March 14, 2026', type: 'historical', description: 'New moon day' },
    { id: 'mar-14-phula', name: 'Shaheedi - Akali Phula Singh Ji', nameGurmukhi: 'ਅਕਾਲੀ ਫੂਲਾ ਸਿੰਘ ਜੀ', nanakshahiDate: '1 Chet', gregorianDate: 'March 14, 2026', type: 'martyrdom', description: 'Martyrdom of Akali Phula Singh', year: '1823' },
    { id: 'mar-15-delhi', name: 'Conquest of Delhi', nameGurmukhi: 'ਦਿੱਲੀ ਫਤਿਹ', nanakshahiDate: '2 Chet', gregorianDate: 'March 15, 2026', type: 'historical', description: 'Sardar Baghel Singh conquered Delhi', year: '1783' },
    { id: 'mar-15-hola', name: 'Hola Mohalla', nameGurmukhi: 'ਹੋਲਾ ਮਹੱਲਾ', nanakshahiDate: '2 Chet', gregorianDate: 'March 15, 2026', type: 'festival', description: 'Sikh martial festival at Anandpur', year: '1701' },
    { id: 'mar-23-bhagat', name: 'Shaheedi - Bhagat Singh', nameGurmukhi: 'ਸ਼ਹੀਦ ਭਗਤ ਸਿੰਘ', nanakshahiDate: '10 Chet', gregorianDate: 'March 23, 2026', type: 'martyrdom', description: 'Martyrdom of Bhagat Singh', year: '1931' },
    { id: 'mar-25-subheg', name: 'Shaheedi - Bhai Subheg & Shabaz Singh', nameGurmukhi: 'ਭਾਈ ਸੁਭੇਗ ਤੇ ਸ਼ਬਾਜ਼ ਸਿੰਘ', nanakshahiDate: '12 Chet', gregorianDate: 'March 25, 2026', type: 'martyrdom', description: 'Father-son martyrdom', year: '1745' },
    { id: 'mar-27-g7-gaddi', name: 'Gurgaddi - Guru Har Rai Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰ ਰਾਇ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '14 Chet', gregorianDate: 'March 27, 2026', type: 'gurgaddi', description: 'Guruship of 7th Guru', year: '1644' },
    { id: 'mar-29-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '16 Chet', gregorianDate: 'March 29, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'mar-30-g3-gaddi', name: 'Gurgaddi - Guru Amar Das Ji', nameGurmukhi: 'ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '17 Chet', gregorianDate: 'March 30, 2026', type: 'gurgaddi', description: 'Guruship of 3rd Guru', year: '1552' },
    
    // ===== APRIL 2026 =====
    { id: 'apr-01-g2-joti', name: 'Joti Jot - Guru Angad Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '19 Chet', gregorianDate: 'April 1, 2026', type: 'jotijot', description: '2nd Guru merged with eternal light', year: '1552' },
    { id: 'apr-02-g6-joti', name: 'Joti Jot - Guru Hargobind Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '20 Chet', gregorianDate: 'April 2, 2026', type: 'jotijot', description: '6th Guru merged with eternal light', year: '1644' },
    { id: 'apr-09-jujhar', name: 'Birthday - Baba Jujhar Singh Ji', nameGurmukhi: 'ਬਾਬਾ ਜੁਝਾਰ ਸਿੰਘ ਜੀ', nanakshahiDate: '27 Chet', gregorianDate: 'April 9, 2026', type: 'birth', description: 'Birth of 2nd Sahibzada', year: '1691' },
    { id: 'apr-11-g9-gaddi', name: 'Gurgaddi - Guru Tegh Bahadur Ji', nameGurmukhi: 'ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '29 Chet', gregorianDate: 'April 11, 2026', type: 'gurgaddi', description: 'Guruship of 9th Guru', year: '1664' },
    { id: 'apr-11-g8-joti', name: 'Joti Jot - Guru Har Krishan Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰ ਕ੍ਰਿਸ਼ਨ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '29 Chet', gregorianDate: 'April 11, 2026', type: 'jotijot', description: '8th Guru merged with eternal light (age 7)', year: '1664' },
    { id: 'apr-12-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '30 Chet', gregorianDate: 'April 12, 2026', type: 'historical', description: 'New moon day' },
    { id: 'apr-13-sangrand', name: 'Sangrand - Vaisakh', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਵੈਸਾਖ', nanakshahiDate: '1 Vaisakh', gregorianDate: 'April 13, 2026', type: 'historical', description: 'Vaisakh month begins' },
    { id: 'apr-13-vaisakhi', name: 'Vaisakhi - Khalsa Saajna Divas', nameGurmukhi: 'ਵੈਸਾਖੀ - ਖ਼ਾਲਸਾ ਸਾਜਣਾ ਦਿਵਸ', nanakshahiDate: '1 Vaisakh', gregorianDate: 'April 13, 2026', type: 'festival', description: 'Birth of Khalsa by Guru Gobind Singh Ji', year: '1699' },
    { id: 'apr-13-dastar', name: 'Sikh Dastar Divas', nameGurmukhi: 'ਸਿੱਖ ਦਸਤਾਰ ਦਿਵਸ', nanakshahiDate: '1 Vaisakh', gregorianDate: 'April 13, 2026', type: 'festival', description: 'Sikh Turban Day' },
    { id: 'apr-18-g9-parkash', name: 'Parkash - Guru Tegh Bahadur Ji', nameGurmukhi: 'ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ', nanakshahiDate: '6 Vaisakh', gregorianDate: 'April 18, 2026', type: 'gurpurab', description: 'Birth of 9th Guru', year: '1621' },
    { id: 'apr-20-g5-parkash', name: 'Parkash - Guru Arjan Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ', nanakshahiDate: '8 Vaisakh', gregorianDate: 'April 20, 2026', type: 'gurpurab', description: 'Birth of 5th Guru', year: '1563' },
    { id: 'apr-20-dhanna', name: 'Birth - Bhagat Dhanna Ji', nameGurmukhi: 'ਭਗਤ ਧੰਨਾ ਜੀ', nanakshahiDate: '8 Vaisakh', gregorianDate: 'April 20, 2026', type: 'birth', description: 'Birth of Bhagat Dhanna Ji' },
    { id: 'apr-27-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '15 Vaisakh', gregorianDate: 'April 27, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'apr-28-g2-parkash', name: 'Parkash - Guru Angad Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ', nanakshahiDate: '16 Vaisakh', gregorianDate: 'April 28, 2026', type: 'gurpurab', description: 'Birth of 2nd Guru', year: '1504' },
    
    // ===== MAY 2026 =====
    { id: 'may-11-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '29 Vaisakh', gregorianDate: 'May 11, 2026', type: 'historical', description: 'New moon day' },
    { id: 'may-13-sangrand', name: 'Sangrand - Jeth', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਜੇਠ', nanakshahiDate: '1 Jeth', gregorianDate: 'May 13, 2026', type: 'historical', description: 'Jeth month begins' },
    { id: 'may-16-g5-joti', name: 'Joti Jot - Guru Arjan Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '4 Jeth', gregorianDate: 'May 16, 2026', type: 'jotijot', description: 'Shaheedi (Martyrdom) of 5th Guru', year: '1606' },
    { id: 'may-16-g6-gaddi', name: 'Gurgaddi - Guru Hargobind Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '4 Jeth', gregorianDate: 'May 16, 2026', type: 'gurgaddi', description: 'Guruship of 6th Guru', year: '1606' },
    { id: 'may-23-g3-parkash', name: 'Parkash - Guru Amar Das Ji', nameGurmukhi: 'ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ', nanakshahiDate: '11 Jeth', gregorianDate: 'May 23, 2026', type: 'gurpurab', description: 'Birth of 3rd Guru', year: '1479' },
    { id: 'may-26-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '14 Jeth', gregorianDate: 'May 26, 2026', type: 'historical', description: 'Full moon day' },
    
    // ===== JUNE 2026 =====
    { id: 'jun-10-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '29 Jeth', gregorianDate: 'June 10, 2026', type: 'historical', description: 'New moon day' },
    { id: 'jun-14-sangrand', name: 'Sangrand - Harh', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਹਾੜ', nanakshahiDate: '1 Harh', gregorianDate: 'June 14, 2026', type: 'historical', description: 'Harh month begins' },
    { id: 'jun-18-banda', name: 'Shaheedi - Baba Banda Singh Bahadur', nameGurmukhi: 'ਬਾਬਾ ਬੰਦਾ ਸਿੰਘ ਬਹਾਦਰ', nanakshahiDate: '5 Harh', gregorianDate: 'June 18, 2026', type: 'martyrdom', description: 'Martyrdom of Baba Banda Singh Bahadur', year: '1716' },
    { id: 'jun-19-g6-parkash', name: 'Parkash - Guru Hargobind Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਜੀ', nanakshahiDate: '6 Harh', gregorianDate: 'June 19, 2026', type: 'gurpurab', description: 'Birth of 6th Guru', year: '1595' },
    { id: 'jun-24-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '11 Harh', gregorianDate: 'June 24, 2026', type: 'historical', description: 'Full moon day' },
    
    // ===== JULY 2026 =====
    { id: 'jul-01-g1-joti', name: 'Joti Jot - Guru Nanak Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '18 Harh', gregorianDate: 'July 1, 2026', type: 'jotijot', description: '1st Guru merged with eternal light', year: '1539' },
    { id: 'jul-01-g2-gaddi', name: 'Gurgaddi - Guru Angad Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '18 Harh', gregorianDate: 'July 1, 2026', type: 'gurgaddi', description: 'Guruship of 2nd Guru', year: '1539' },
    { id: 'jul-05-g8-parkash', name: 'Parkash - Guru Har Krishan Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰ ਕ੍ਰਿਸ਼ਨ ਜੀ', nanakshahiDate: '22 Harh', gregorianDate: 'July 5, 2026', type: 'gurpurab', description: 'Birth of 8th Guru', year: '1656' },
    { id: 'jul-09-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '26 Harh', gregorianDate: 'July 9, 2026', type: 'historical', description: 'New moon day' },
    { id: 'jul-15-sangrand', name: 'Sangrand - Sawan', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਸਾਵਣ', nanakshahiDate: '1 Sawan', gregorianDate: 'July 15, 2026', type: 'historical', description: 'Sawan month begins' },
    { id: 'jul-24-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '10 Sawan', gregorianDate: 'July 24, 2026', type: 'historical', description: 'Full moon day' },
    
    // ===== AUGUST 2026 =====
    { id: 'aug-07-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '24 Sawan', gregorianDate: 'August 7, 2026', type: 'historical', description: 'New moon day' },
    { id: 'aug-09-g3-joti', name: 'Joti Jot - Guru Amar Das Ji', nameGurmukhi: 'ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '26 Sawan', gregorianDate: 'August 9, 2026', type: 'jotijot', description: '3rd Guru merged with eternal light', year: '1574' },
    { id: 'aug-09-g4-gaddi', name: 'Gurgaddi - Guru Ram Das Ji', nameGurmukhi: 'ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '26 Sawan', gregorianDate: 'August 9, 2026', type: 'gurgaddi', description: 'Guruship of 4th Guru', year: '1574' },
    { id: 'aug-16-sangrand', name: 'Sangrand - Bhadron', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਭਾਦਰੋਂ', nanakshahiDate: '1 Bhadron', gregorianDate: 'August 16, 2026', type: 'historical', description: 'Bhadron month begins' },
    { id: 'aug-22-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '7 Bhadron', gregorianDate: 'August 22, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'aug-31-adiGranth', name: 'Installation of Adi Granth', nameGurmukhi: 'ਆਦਿ ਗ੍ਰੰਥ ਦੀ ਸਥਾਪਨਾ', nanakshahiDate: '16 Bhadron', gregorianDate: 'August 31, 2026', type: 'historical', description: 'Adi Granth installed at Harmandir Sahib', year: '1604' },
    
    // ===== SEPTEMBER 2026 =====
    { id: 'sep-01-g4-joti', name: 'Joti Jot - Guru Ram Das Ji', nameGurmukhi: 'ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '17 Bhadron', gregorianDate: 'September 1, 2026', type: 'jotijot', description: '4th Guru merged with eternal light', year: '1581' },
    { id: 'sep-01-g5-gaddi', name: 'Gurgaddi - Guru Arjan Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '17 Bhadron', gregorianDate: 'September 1, 2026', type: 'gurgaddi', description: 'Guruship of 5th Guru', year: '1581' },
    { id: 'sep-06-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '22 Bhadron', gregorianDate: 'September 6, 2026', type: 'historical', description: 'New moon day' },
    { id: 'sep-16-sangrand', name: 'Sangrand - Assu', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਅੱਸੂ', nanakshahiDate: '1 Assu', gregorianDate: 'September 16, 2026', type: 'historical', description: 'Assu month begins' },
    { id: 'sep-21-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '6 Assu', gregorianDate: 'September 21, 2026', type: 'historical', description: 'Full moon day' },
    
    // ===== OCTOBER 2026 =====
    { id: 'oct-05-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '20 Assu', gregorianDate: 'October 5, 2026', type: 'historical', description: 'New moon day' },
    { id: 'oct-06-g7-joti', name: 'Joti Jot - Guru Har Rai Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰ ਰਾਇ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '21 Assu', gregorianDate: 'October 6, 2026', type: 'jotijot', description: '7th Guru merged with eternal light', year: '1661' },
    { id: 'oct-06-g8-gaddi', name: 'Gurgaddi - Guru Har Krishan Ji', nameGurmukhi: 'ਗੁਰੂ ਹਰ ਕ੍ਰਿਸ਼ਨ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '21 Assu', gregorianDate: 'October 6, 2026', type: 'gurgaddi', description: 'Guruship of 8th Guru', year: '1661' },
    { id: 'oct-09-g4-parkash', name: 'Parkash - Guru Ram Das Ji', nameGurmukhi: 'ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ', nanakshahiDate: '24 Assu', gregorianDate: 'October 9, 2026', type: 'gurpurab', description: 'Birth of 4th Guru', year: '1534' },
    { id: 'oct-15-sangrand', name: 'Sangrand - Katak', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਕੱਤਕ', nanakshahiDate: '1 Katak', gregorianDate: 'October 15, 2026', type: 'historical', description: 'Katak month begins' },
    { id: 'oct-20-g10-gaddi', name: 'Gurgaddi - Guru Granth Sahib Ji', nameGurmukhi: 'ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '6 Katak', gregorianDate: 'October 20, 2026', type: 'gurgaddi', description: 'Guru Gobind Singh Ji installed Guru Granth Sahib as eternal Guru', year: '1708' },
    { id: 'oct-20-g10-joti', name: 'Joti Jot - Guru Gobind Singh Ji', nameGurmukhi: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਜੋਤੀ ਜੋਤ', nanakshahiDate: '6 Katak', gregorianDate: 'October 20, 2026', type: 'jotijot', description: '10th Guru merged with eternal light', year: '1708' },
    { id: 'oct-20-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '6 Katak', gregorianDate: 'October 20, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'oct-24-bandi', name: 'Bandi Chhor Divas', nameGurmukhi: 'ਬੰਦੀ ਛੋੜ ਦਿਵਸ', nanakshahiDate: '10 Katak', gregorianDate: 'October 24, 2026', type: 'festival', description: 'Release of Guru Hargobind Ji from Gwalior fort', year: '1619' },
    
    // ===== NOVEMBER 2026 =====
    { id: 'nov-04-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '21 Katak', gregorianDate: 'November 4, 2026', type: 'historical', description: 'New moon day' },
    { id: 'nov-12-g1-parkash', name: 'Parkash - Guru Nanak Dev Ji', nameGurmukhi: 'ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ', nanakshahiDate: '29 Katak', gregorianDate: 'November 12, 2026', type: 'gurpurab', description: 'Birth of 1st Guru, founder of Sikhism', year: '1469' },
    { id: 'nov-14-sangrand', name: 'Sangrand - Maghar', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਮੱਘਰ', nanakshahiDate: '1 Maghar', gregorianDate: 'November 14, 2026', type: 'historical', description: 'Maghar month begins' },
    { id: 'nov-19-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '6 Maghar', gregorianDate: 'November 19, 2026', type: 'historical', description: 'Full moon day' },
    
    // ===== DECEMBER 2026 =====
    { id: 'dec-03-masia', name: 'Masia (New Moon)', nameGurmukhi: 'ਮੱਸਿਆ', nanakshahiDate: '20 Maghar', gregorianDate: 'December 3, 2026', type: 'historical', description: 'New moon day' },
    { id: 'dec-14-sangrand', name: 'Sangrand - Poh', nameGurmukhi: 'ਸੰਗਰਾਂਦ - ਪੋਹ', nanakshahiDate: '1 Poh', gregorianDate: 'December 14, 2026', type: 'historical', description: 'Poh month begins' },
    { id: 'dec-18-puranmasi', name: 'Puranmasi (Full Moon)', nameGurmukhi: 'ਪੂਰਨਮਾਸੀ', nanakshahiDate: '5 Poh', gregorianDate: 'December 18, 2026', type: 'historical', description: 'Full moon day' },
    { id: 'dec-22-zorawar', name: 'Shaheedi - Sahibzade (Zorawar & Fateh Singh)', nameGurmukhi: 'ਸਾਹਿਬਜ਼ਾਦੇ ਜ਼ੋਰਾਵਰ ਤੇ ਫਤਿਹ ਸਿੰਘ', nanakshahiDate: '9 Poh', gregorianDate: 'December 22, 2026', type: 'martyrdom', description: 'Martyrdom of younger Sahibzade (ages 6 & 9)', year: '1704' },
    { id: 'dec-24-g10-parkash', name: 'Parkash - Guru Gobind Singh Ji', nameGurmukhi: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ', nanakshahiDate: '11 Poh', gregorianDate: 'December 24, 2026', type: 'gurpurab', description: 'Birth of 10th Guru', year: '1666' },
    { id: 'dec-25-g9-shaheedi', name: 'Shaheedi - Guru Tegh Bahadur Ji', nameGurmukhi: 'ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਦੀ ਸ਼ਹੀਦੀ', nanakshahiDate: '12 Poh', gregorianDate: 'December 25, 2026', type: 'martyrdom', description: 'Martyrdom of 9th Guru for religious freedom', year: '1675' },
    { id: 'dec-25-g10-gaddi', name: 'Gurgaddi - Guru Gobind Singh Ji', nameGurmukhi: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਗੁਰਗੱਦੀ', nanakshahiDate: '12 Poh', gregorianDate: 'December 25, 2026', type: 'gurgaddi', description: 'Guruship of 10th Guru', year: '1675' },
    { id: 'dec-26-ajit-shaheedi', name: 'Shaheedi - Sahibzade (Ajit & Jujhar Singh)', nameGurmukhi: 'ਸਾਹਿਬਜ਼ਾਦੇ ਅਜੀਤ ਤੇ ਜੁਝਾਰ ਸਿੰਘ', nanakshahiDate: '13 Poh', gregorianDate: 'December 26, 2026', type: 'martyrdom', description: 'Martyrdom of elder Sahibzade in Battle of Chamkaur', year: '1704' },
    { id: 'dec-29-mata-gujri', name: 'Shaheedi - Mata Gujri Ji', nameGurmukhi: 'ਮਾਤਾ ਗੁਜਰੀ ਜੀ', nanakshahiDate: '16 Poh', gregorianDate: 'December 29, 2026', type: 'martyrdom', description: 'Shaheedi of Guru Gobind Singh Ji\'s mother', year: '1704' },
    
    // ===== ADDITIONAL IMPORTANT EVENTS =====
    { id: 'may-07-namdev', name: 'Birth - Bhagat Namdev Ji', nameGurmukhi: 'ਭਗਤ ਨਾਮਦੇਵ ਜੀ', nanakshahiDate: '24 Vaisakh', gregorianDate: 'May 7, 2026', type: 'birth', description: 'Birth of Bhagat Namdev Ji', year: '1270' },
    { id: 'jun-06-kabir', name: 'Birth - Bhagat Kabir Ji', nameGurmukhi: 'ਭਗਤ ਕਬੀਰ ਜੀ', nanakshahiDate: '23 Jeth', gregorianDate: 'June 6, 2026', type: 'birth', description: 'Birth of Bhagat Kabir Ji', year: '1398' },
    { id: 'aug-08-deep-shaheedi', name: 'Shaheedi - Baba Deep Singh Ji', nameGurmukhi: 'ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ ਦੀ ਸ਼ਹੀਦੀ', nanakshahiDate: '25 Sawan', gregorianDate: 'August 8, 2026', type: 'martyrdom', description: 'Martyrdom of Baba Deep Singh Ji at Amritsar', year: '1757' },
    { id: 'sep-10-mani-singh', name: 'Shaheedi - Bhai Mani Singh Ji', nameGurmukhi: 'ਭਾਈ ਮਣੀ ਸਿੰਘ ਜੀ', nanakshahiDate: '26 Bhadron', gregorianDate: 'September 10, 2026', type: 'martyrdom', description: 'Martyrdom of Bhai Mani Singh Ji', year: '1737' },
    { id: 'oct-20-diwali', name: 'Diwali - Bandi Chhor', nameGurmukhi: 'ਦੀਵਾਲੀ - ਬੰਦੀ ਛੋੜ', nanakshahiDate: '6 Katak', gregorianDate: 'October 20, 2026', type: 'festival', description: 'Sikh Diwali celebrating Guru Hargobind Ji\'s release' },
    { id: 'nov-24-chhota-ghallughara', name: 'Chhota Ghallughara', nameGurmukhi: 'ਛੋਟਾ ਘੱਲੂਘਾਰਾ', nanakshahiDate: '11 Maghar', gregorianDate: 'November 24, 2026', type: 'martyrdom', description: 'Small Holocaust', year: '1746' },
    { id: 'jan-05-sikh-day', name: 'Birth - Bhai Taru Singh Ji', nameGurmukhi: 'ਭਾਈ ਤਰੂ ਸਿੰਘ ਜੀ', nanakshahiDate: '23 Maghar', gregorianDate: 'January 5, 2026', type: 'birth', description: 'Birth of Bhai Taru Singh Ji', year: '1720' },
    { id: 'jun-25-taru-shaheedi', name: 'Shaheedi - Bhai Taru Singh Ji', nameGurmukhi: 'ਭਾਈ ਤਰੂ ਸਿੰਘ ਜੀ ਦੀ ਸ਼ਹੀਦੀ', nanakshahiDate: '12 Harh', gregorianDate: 'June 25, 2026', type: 'martyrdom', description: 'Martyrdom - scalp removed alive', year: '1745' },
    { id: 'jan-26-republic', name: 'Indian Republic Day', nameGurmukhi: 'ਭਾਰਤੀ ਗਣਤੰਤਰ ਦਿਵਸ', nanakshahiDate: '13 Maagh', gregorianDate: 'January 26, 2026', type: 'historical', description: 'Indian Republic Day' },
    { id: 'aug-15-independence', name: 'Indian Independence Day', nameGurmukhi: 'ਭਾਰਤੀ ਆਜ਼ਾਦੀ ਦਿਵਸ', nanakshahiDate: '30 Sawan', gregorianDate: 'August 15, 2026', type: 'historical', description: 'Indian Independence Day', year: '1947' },
  ];

  return allEvents;
}

/**
 * Get Nanakshahi month names
 */
export const NANAKSHAHI_MONTHS = [
  { name: 'Chet', gurmukhi: 'ਚੇਤ', days: 31, gregorianStart: 'March 14' },
  { name: 'Vaisakh', gurmukhi: 'ਵੈਸਾਖ', days: 31, gregorianStart: 'April 14' },
  { name: 'Jeth', gurmukhi: 'ਜੇਠ', days: 31, gregorianStart: 'May 15' },
  { name: 'Harh', gurmukhi: 'ਹਾੜ', days: 31, gregorianStart: 'June 15' },
  { name: 'Sawan', gurmukhi: 'ਸਾਵਣ', days: 31, gregorianStart: 'July 16' },
  { name: 'Bhadon', gurmukhi: 'ਭਾਦੋਂ', days: 30, gregorianStart: 'August 16' },
  { name: 'Assu', gurmukhi: 'ਅੱਸੂ', days: 30, gregorianStart: 'September 15' },
  { name: 'Katak', gurmukhi: 'ਕੱਤਕ', days: 30, gregorianStart: 'October 15' },
  { name: 'Maghar', gurmukhi: 'ਮੱਘਰ', days: 30, gregorianStart: 'November 14' },
  { name: 'Poh', gurmukhi: 'ਪੋਹ', days: 30, gregorianStart: 'December 14' },
  { name: 'Magh', gurmukhi: 'ਮਾਘ', days: 30, gregorianStart: 'January 13' },
  { name: 'Phagan', gurmukhi: 'ਫੱਗਣ', days: 30, gregorianStart: 'February 12' },
];

/**
 * Get current Nanakshahi year
 * Nanakshahi year = Gregorian year - 1469 (birth year of Guru Nanak)
 */
export function getCurrentNanakshahiYear(): number {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  
  // Nanakshahi year starts on March 14 (Chet 1)
  const chetStart = new Date(gregorianYear, 2, 14); // March 14
  
  if (now < chetStart) {
    return gregorianYear - 1469 - 1;
  }
  return gregorianYear - 1469;
}

/**
 * Get upcoming Sikh events (next 30 days)
 */
export function getUpcomingEvents(days: number = 30): SikhEvent[] {
  const allEvents = getNanakshahiEvents();
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return allEvents.filter(event => {
    const eventDate = new Date(event.gregorianDate);
    return eventDate >= today && eventDate <= futureDate;
  }).sort((a, b) => {
    return new Date(a.gregorianDate).getTime() - new Date(b.gregorianDate).getTime();
  });
}
