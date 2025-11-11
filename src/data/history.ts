// Sikh History Data
// Content summarized from various scholarly sources with proper attribution

export interface HistorySource {
  title: string;
  author: string;
  year: string;
  link: string;
  license: string;
}

export interface HistoryArticle {
  id: string;
  title: string;
  titleGurmukhi?: string;
  period: string;
  era: 'gurus' | 'warriors' | 'modern' | '1984';
  summary: string;
  content: string;
  contentWarning?: string;
  sources: HistorySource[];
  relatedArticles?: string[];
}

export interface HistoryEra {
  id: string;
  title: string;
  titleGurmukhi: string;
  period: string;
  description: string;
  icon: string;
  articles: string[];
}

// Historical Sources
export const historicalSources: { [key: string]: HistorySource } = {
  grewal_persian: {
    title: "Sikh History From Persian Sources",
    author: "JS Grewal & Irfan Habib",
    year: "Various",
    link: "https://www.vidhia.com/Historical%2C%20Political%2C%20Philosophical%20and%20Informational/Sikh_History_From_Persian_Sources_-_JS_Grewal_Irfan_Habib.pdf",
    license: "Scholarly use - check permissions"
  },
  ganda_singh: {
    title: "Contemporary Sources of Sikh History (1469-1708)",
    author: "Dr Ganda Singh",
    year: "Various",
    link: "https://www.scribd.com/document/330360478/Contemporary-Sources-of-Sikh-History-1469-1708-Dr-Ganda-Singh",
    license: "All Rights Reserved - summarized content"
  },
  cunningham: {
    title: "History of Sikhism: From the Origin of the Nation to the Battles of the Sutlej",
    author: "Joseph Davey Cunningham",
    year: "1903",
    link: "https://archive.org",
    license: "Public Domain"
  },
  hari_ram_gupta: {
    title: "The History of the Sikhs, Volume 1: 1469-1839",
    author: "Hari Ram Gupta",
    year: "Various editions",
    link: "Various archives",
    license: "Check edition for copyright status"
  },
  panth_prakash: {
    title: "Panth Prakash",
    author: "Rattan Singh Bhangu",
    year: "1841",
    link: "https://en.wikipedia.org/wiki/Panth_Prakash",
    license: "Historical text - Public Domain"
  },
  martyrs_1984: {
    title: "Never Ever We Forget Our Martyrs – Genocide Nov 1984",
    author: "Various contributors",
    year: "2015",
    link: "https://archive.org/details/NeverEverWeForgetOurMartyrsGenocideNov1984",
    license: "Public Domain Mark 1.0"
  },
  devgan_1984: {
    title: "The Digital Story of 1984: Diasporic Sikhs",
    author: "S. Devgan",
    year: "Recent",
    link: "https://punjab.global.ucsb.edu/sites/default/files/sitefiles/journals/volume22/8-Shruti%20Devgan%2022.2_FINAL.pdf",
    license: "Academic article - summarized content"
  },
  nanavati_commission: {
    title: "Report of the Nanavati Commission on Delhi riots 1984",
    author: "Ministry of Home Affairs, India",
    year: "2005",
    link: "https://www.mha.gov.in/sites/default/files/2022-08/Nanavati-I_eng_0%5B1%5D.pdf",
    license: "Government report - Public domain with attribution"
  },
  sikhs_outside_punjab: {
    title: "Sikhs Outside Punjab",
    author: "UNHCR/RefWorld",
    year: "1992",
    link: "https://www.refworld.org/reference/countryrep/irbc/1992/en/22034",
    license: "UN document - Non-commercial use"
  }
};

// History Articles
export const historyArticles: HistoryArticle[] = [
  // GURUS ERA (1469-1708)
  {
    id: 'guru_nanak_dev_ji',
    title: 'Guru Nanak Dev Ji - The Founder',
    titleGurmukhi: 'ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
    period: '1469-1539',
    era: 'gurus',
    summary: 'The founder of Sikhism who traveled extensively spreading the message of one God and equality.',
    content: `Guru Nanak Dev Ji was born in 1469 in Talwandi (now Nankana Sahib, Pakistan). He founded Sikhism and established the core principles that would guide the faith for centuries to come.

Key Teachings:
• Ik Onkar - There is One God
• Equality of all humans regardless of caste, creed, or gender
• Honest living and sharing with others (Kirat Karo, Vand Chakko)
• Constant remembrance of God (Naam Japna)

Udasis (Spiritual Journeys):
Guru Nanak Dev Ji traveled extensively across India, Tibet, Arabia, and Persia, covering over 28,000 km on foot. During these journeys, he engaged in dialogues with religious leaders and common people alike, spreading his message of unity and devotion.

Legacy:
He established the town of Kartarpur and appointed Guru Angad Dev Ji as his successor, beginning the lineage of ten Sikh Gurus. His hymns form a significant part of the Guru Granth Sahib.`,
    sources: [historicalSources.grewal_persian, historicalSources.ganda_singh, historicalSources.cunningham]
  },
  {
    id: 'ten_gurus',
    title: 'The Ten Sikh Gurus',
    titleGurmukhi: 'ਦਸ ਗੁਰੂ ਸਾਹਿਬਾਨ',
    period: '1469-1708',
    era: 'gurus',
    summary: 'An overview of all ten Sikh Gurus and their contributions to Sikhism.',
    content: `The spiritual leadership of Sikhism passed through ten enlightened Gurus over a period of 239 years:

1. Guru Nanak Dev Ji (1469-1539): Founder of Sikhism, established core principles
2. Guru Angad Dev Ji (1539-1552): Standardized Gurmukhi script, promoted physical fitness
3. Guru Amar Das Ji (1552-1574): Established langar (community kitchen), promoted women's rights
4. Guru Ram Das Ji (1574-1581): Founded the city of Amritsar, composed Lavan (Sikh wedding hymns)
5. Guru Arjan Dev Ji (1581-1606): Compiled Adi Granth, built Golden Temple, first Sikh martyr
6. Guru Hargobind Ji (1606-1644): Introduced Miri-Piri (temporal and spiritual authority)
7. Guru Har Rai Ji (1644-1661): Maintained peace, established herbal medicine centers
8. Guru Har Krishan Ji (1661-1664): Youngest Guru, served smallpox victims in Delhi
9. Guru Tegh Bahadur Ji (1664-1675): Traveled extensively, martyred for protecting religious freedom
10. Guru Gobind Singh Ji (1675-1708): Created Khalsa, declared Guru Granth Sahib as eternal Guru

Each Guru built upon the foundation laid by Guru Nanak Dev Ji, strengthening both the spiritual and temporal aspects of Sikhism.`,
    sources: [historicalSources.ganda_singh, historicalSources.cunningham, historicalSources.hari_ram_gupta]
  },
  {
    id: 'guru_gobind_singh',
    title: 'Guru Gobind Singh Ji and the Khalsa',
    titleGurmukhi: 'ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਅਤੇ ਖਾਲਸਾ',
    period: '1675-1708',
    era: 'gurus',
    summary: 'The tenth Guru who created the Khalsa and established the Guru Granth Sahib as eternal Guru.',
    content: `Guru Gobind Singh Ji, the tenth and final human Guru of the Sikhs, transformed the Sikh community into a powerful force for righteousness and justice.

Creation of the Khalsa (1699):
On Vaisakhi day in 1699, Guru Gobind Singh Ji created the Khalsa (the pure ones) at Anandpur Sahib. He called for volunteers willing to sacrifice their lives, and five devoted Sikhs stepped forward. These became known as the Panj Piare (Five Beloved Ones).

The Khalsa Code:
• Five Ks: Kesh (uncut hair), Kangha (comb), Kara (steel bracelet), Kirpan (sword), Kachera (undergarment)
• Equality: All Khalsa members took the surname Singh (lion) or Kaur (princess)
• Purpose: To protect the weak and fight against injustice

Military Achievements:
Guru Gobind Singh Ji fought numerous battles against Mughal and Hill rulers who sought to suppress religious freedom. Despite facing immense personal losses (all four sons were martyred), he never wavered in his mission.

Literary Contributions:
He composed the Dasam Granth and numerous other works. His writing style combined spiritual depth with martial vigor.

Final Act:
Before his death in 1708, Guru Gobind Singh Ji declared the Guru Granth Sahib as the eternal Guru of the Sikhs, ending the line of human Gurus.`,
    sources: [historicalSources.ganda_singh, historicalSources.cunningham, historicalSources.panth_prakash]
  },

  // WARRIOR ERA (1708-1849)
  {
    id: 'banda_singh_bahadur',
    title: 'Banda Singh Bahadur',
    titleGurmukhi: 'ਬੰਦਾ ਸਿੰਘ ਬਹਾਦਰ',
    period: '1708-1716',
    era: 'warriors',
    summary: 'The first military leader of the Khalsa who established Sikh rule in Punjab.',
    content: `Banda Singh Bahadur, originally named Lachhman Dev, was a hermit who became a warrior after meeting Guru Gobind Singh Ji. He led the Khalsa in their first major military campaign.

Early Military Successes:
After Guru Gobind Singh Ji's death, Banda Singh Bahadur led Sikh forces to numerous victories. In 1710, he captured Sirhind, avenging the martyrdom of Guru Gobind Singh Ji's younger sons. He established the first Sikh state with its capital at Mukhlispur (renamed Lohgarh).

Administrative Reforms:
• Abolished the zamindari system
• Distributed land to farmers
• Issued coins in the name of Guru Nanak and Guru Gobind Singh
• Established a just administration

Capture and Martyrdom:
After years of guerrilla warfare, Banda Singh Bahadur was captured in 1715. He was brought to Delhi where he and his followers faced brutal torture. Despite offers to convert to Islam, they remained steadfast. Banda Singh Bahadur was executed in June 1716, but his legacy inspired future Sikh warriors.`,
    sources: [historicalSources.panth_prakash, historicalSources.cunningham, historicalSources.hari_ram_gupta]
  },
  {
    id: 'misl_period',
    title: 'The Sikh Misls - Warrior Confederacy',
    titleGurmukhi: 'ਸਿੱਖ ਮਿਸਲਾਂ',
    period: '1716-1799',
    era: 'warriors',
    summary: 'The era of twelve Sikh warrior bands that defended Punjab and established Sikh sovereignty.',
    content: `After Banda Singh Bahadur's martyrdom, the Sikhs organized into twelve independent military bands called Misls. This period represents one of the most remarkable examples of guerrilla warfare and political organization in history.

The Twelve Misls:
1. Bhangi Misl
2. Kanhaiya Misl
3. Nakkai Misl
4. Ahluwalia Misl
5. Dallewalia Misl
6. Faizullapuria Misl
7. Karorsinghia Misl
8. Nishanwalia Misl
9. Shaheed Misl
10. Singhpuria Misl
11. Sukerchakia Misl (led by Maharaja Ranjit Singh's grandfather)
12. Phulkian Misl

Organization and Strategy:
The Misls operated independently but united when facing common threats. They held biannual meetings at Akal Takht to make collective decisions. Their guerrilla tactics frustrated larger Mughal and Afghan armies.

Achievements:
• Defended Punjab against repeated invasions by Ahmad Shah Abdali
• Established control over most of Punjab by 1765
• Created a unique democratic military structure
• Protected religious and cultural institutions

The Misl period ended when Maharaja Ranjit Singh unified them into a single Sikh Empire.`,
    sources: [historicalSources.panth_prakash, historicalSources.cunningham, historicalSources.hari_ram_gupta]
  },
  {
    id: 'sikh_empire',
    title: 'The Sikh Empire under Maharaja Ranjit Singh',
    titleGurmukhi: 'ਮਹਾਰਾਜਾ ਰਣਜੀਤ ਸਿੰਘ ਦਾ ਸਾਮਰਾਜ',
    period: '1799-1849',
    era: 'warriors',
    summary: 'The golden era of Sikh sovereignty under the "Lion of Punjab".',
    content: `Maharaja Ranjit Singh (1780-1839) united the Sikh Misls and established one of the most powerful empires in South Asia. His reign is considered the golden age of Sikh sovereignty.

Rise to Power:
At age 12, Ranjit Singh led his first military campaign. By 1799, he captured Lahore and declared himself Maharaja. He then systematically unified the various Sikh Misls under his rule.

Empire at its Peak:
The Sikh Empire extended from Tibet to Afghanistan and from Kashmir to Sindh. It was one of the last major indigenous powers before British colonization of India.

Modernization and Military:
• Created a modern, disciplined army called the Khalsa Army
• Hired European officers to train troops in modern warfare
• Established artillery factories and arms manufacturing
• Built a strong cavalry and infantry

Secular Governance:
Despite being a Sikh empire, Ranjit Singh's government was remarkably secular:
• Muslims held important positions (Fakir Azizuddin was Foreign Minister)
• Hindus, Muslims, and Sikhs served equally in administration
• Protected all religious sites, including Hindu temples and Muslim mosques
• Prevented religious discrimination

Cultural Flourishing:
• Gold-plated the Harmandir Sahib (Golden Temple)
• Patronized arts, architecture, and literature
• Promoted trade and economic development
• Built roads, schools, and infrastructure

Legacy:
After Maharaja Ranjit Singh's death in 1839, internal conflicts and British betrayal led to the fall of the empire. However, his legacy as a just, secular, and powerful ruler remains inspirational.`,
    sources: [historicalSources.cunningham, historicalSources.hari_ram_gupta, historicalSources.panth_prakash]
  },
  {
    id: 'anglo_sikh_wars',
    title: 'The Anglo-Sikh Wars',
    titleGurmukhi: 'ਐਂਗਲੋ-ਸਿੱਖ ਯੁੱਧ',
    period: '1845-1849',
    era: 'warriors',
    summary: 'The fierce battles between the Sikh Empire and British East India Company that ended Sikh sovereignty.',
    content: `After Maharaja Ranjit Singh's death, the British saw an opportunity to conquer Punjab. The resulting conflicts showcased the extraordinary bravery of Sikh soldiers.

First Anglo-Sikh War (1845-1846):
Internal court intrigues weakened the empire, but the Khalsa Army remained formidable. Major battles included:
• Battle of Mudki: British victory but with heavy casualties
• Battle of Ferozeshah: Described by British as their "Waterloo"
• Battle of Sobraon: Decisive but costly British victory

The war ended with the Treaty of Lahore, which reduced Sikh territory and imposed a British Resident in Lahore.

Second Anglo-Sikh War (1848-1849):
Triggered by rebellions against British interference, this war included:
• Battle of Ramnagar
• Battle of Chillianwala: Sikhs inflicted heavy casualties; British nearly lost
• Battle of Gujrat: Final battle resulting in British victory

Battle of Chillianwala (1849):
This battle was so fierce that British forces came close to defeat. Sikh soldiers fought with extraordinary valor, and British casualties were the highest in any Indian battle. However, betrayal by some commanders and overwhelming British resources eventually led to defeat.

Annexation:
In March 1849, Punjab was annexed by the British East India Company. The young Maharaja Duleep Singh was exiled to Britain. The Sikh Empire had ended, but the valor of the Khalsa Army earned respect even from their adversaries.

British Perspective:
British historians and military leaders praised the Sikh Army as the most formidable force they encountered in India. The courage and military skill of Sikh soldiers became legendary.`,
    sources: [historicalSources.cunningham, historicalSources.hari_ram_gupta]
  },

  // MODERN SIKH HISTORY (1849-1984)
  {
    id: 'british_colonial_period',
    title: 'Sikhs Under British Rule',
    titleGurmukhi: 'ਬ੍ਰਿਟਿਸ਼ ਰਾਜ ਦੇ ਹੇਠ ਸਿੱਖ',
    period: '1849-1947',
    era: 'modern',
    summary: 'How Sikhs adapted and resisted during British colonial rule, from soldiers to freedom fighters.',
    content: `After annexation, the British recognized Sikh military prowess and recruited them heavily into the British Indian Army. However, Sikhs also played crucial roles in India's independence movement.

Military Service:
Sikhs made up a disproportionately large part of the British Indian Army:
• Served in both World Wars with distinction
• Fought in France, Africa, Middle East, and Asia
• Earned numerous medals for valor
• Over 83,000 Sikh soldiers died in World War I alone

Gurdwara Reform Movement:
In the early 1920s, Sikhs launched the Gurdwara Reform Movement to reclaim control of their religious sites from corrupt mahants (managers). This movement was notable for its non-violent resistance and led to the Sikh Gurdwaras Act of 1925, establishing the SGPC (Shiromani Gurdwara Parbandhak Committee).

Role in Independence Movement:
Despite their representation in the military, many Sikhs actively participated in India's freedom struggle:
• Bhagat Singh: Revolutionary freedom fighter executed at age 23
• Kartar Singh Sarabha: Founding member of Ghadar Party
• Udham Singh: Assassinated Michael O'Dwyer to avenge Jallianwala Bagh Massacre
• Master Tara Singh: Led political mobilization for Sikh rights

Partition of India (1947):
The partition of India was particularly traumatic for Sikhs:
• Punjab was divided between India and Pakistan
• Sikhs lost access to important historical gurdwaras
• Massive displacement and communal violence
• Hundreds of thousands killed in riots
• Lahore, the capital of the Sikh Empire, went to Pakistan`,
    sources: [historicalSources.cunningham, historicalSources.hari_ram_gupta]
  },
  {
    id: 'post_independence',
    title: 'Sikhs in Independent India',
    titleGurmukhi: 'ਆਜ਼ਾਦ ਭਾਰਤ ਵਿੱਚ ਸਿੱਖ',
    period: '1947-1984',
    era: 'modern',
    summary: 'The Sikh community\'s contributions and challenges in independent India.',
    content: `After independence, Sikhs made tremendous contributions to India's development while also facing unique challenges.

Contributions to Nation-Building:
• Agriculture: Led the Green Revolution in Punjab, making India food self-sufficient
• Military: Continued disproportionate representation in armed forces
• Business: Established successful enterprises across India and globally
• Administration: Served in top positions including Prime Minister (Dr. Manmohan Singh)

Linguistic and Political Movements:
• Punjabi Suba Movement (1950s-60s): Campaign for a Punjabi-speaking state
• Formation of Punjab state in 1966
• Political representation through Akali Dal and other parties

Economic Prosperity:
Punjab became India's richest state per capita by the 1970s, largely due to Sikh farmers' hard work and entrepreneurship.

Challenges:
• Linguistic and religious identity concerns
• Water rights disputes with neighboring states
• Political marginalization concerns
• Growing tensions in the 1970s-80s

Despite challenges, the Sikh community continued to thrive, maintaining their distinct identity while contributing significantly to Indian society.`,
    sources: [historicalSources.sikhs_outside_punjab]
  },

  // 1984 AND AFTER
  {
    id: 'operation_bluestar',
    title: 'Operation Blue Star',
    titleGurmukhi: 'ਆਪ੍ਰੇਸ਼ਨ ਬਲੂ ਸਟਾਰ',
    period: 'June 1984',
    era: '1984',
    contentWarning: '⚠️ This article contains descriptions of violence and traumatic events.',
    summary: 'The Indian Army\'s controversial military operation on the Golden Temple complex.',
    content: `In June 1984, the Indian Army launched a military operation called "Operation Blue Star" on the Golden Temple complex in Amritsar, the holiest shrine of Sikhism.

Background:
Tensions had been building in Punjab throughout the early 1980s over various political and economic grievances. A militant movement led by Jarnail Singh Bhindranwale had taken refuge in the Golden Temple complex.

The Operation (June 1-8, 1984):
• Army entered the Golden Temple complex on June 1 during a religious gathering
• Heavy artillery and tanks were used
• Fierce fighting lasted several days
• Damage to the Akal Takht and other structures
• Simultaneous operations on 40+ other gurdwaras across Punjab

Casualties:
Exact numbers remain disputed:
• Official estimates: ~500 deaths
• Independent estimates: 1,000-5,000+ deaths
• Hundreds of pilgrims trapped inside during the operation
• Many army personnel also killed

Impact on Sikh Community:
The operation deeply wounded Sikh sentiments worldwide:
• Desecration of the holiest Sikh shrine
• Timing during a major religious gathering (martyrdom day of Guru Arjan Dev Ji)
• Restricted movement and curfews across Punjab
• Mass protests globally
• Thousands of Sikh soldiers deserted or turned in their medals

This event led directly to further tragic consequences in the following months.

Note: This remains a sensitive and painful topic for the Sikh community. Multiple perspectives exist on the causes, conduct, and consequences of this operation.`,
    sources: [historicalSources.martyrs_1984, historicalSources.devgan_1984],
    relatedArticles: ['anti_sikh_riots_1984', 'aftermath_1984']
  },
  {
    id: 'anti_sikh_riots_1984',
    title: '1984 Anti-Sikh Violence',
    titleGurmukhi: '1984 ਸਿੱਖ ਵਿਰੋਧੀ ਹਿੰਸਾ',
    period: 'October-November 1984',
    era: '1984',
    contentWarning: '⚠️ This article contains descriptions of extreme violence, genocide, and traumatic events. Reader discretion is strongly advised.',
    summary: 'The systematic violence against Sikhs following the assassination of Prime Minister Indira Gandhi.',
    content: `Following the assassination of Prime Minister Indira Gandhi on October 31, 1984, by her Sikh bodyguards (in response to Operation Blue Star), organized violence erupted against Sikhs across India, particularly in Delhi.

Nature of Violence (October 31 - November 4, 1984):
The violence was systematic and organized:
• Mobs targeted Sikh homes and businesses with voter lists
• Sikhs were pulled from trains, buses, and vehicles
• Men were killed by burning alive, beating, or other brutal methods
• Women were subjected to sexual violence
• Properties were looted and burned
• Police often stood by or participated

Scale of Tragedy:
• Official death toll: ~3,000
• Independent estimates: 8,000-17,000 deaths
• Delhi was the worst affected (2,800+ deaths)
• Thousands widowed and orphaned
• Massive property destruction

Testimonies:
Survivors and witnesses described horrific scenes:
• Entire families burned alive
• Young Sikh men targeted specifically
• Children witnessing their fathers killed
• Neighbors turning on neighbors
• "When a big tree falls, the earth shakes" - a leader's controversial statement

Government Response:
• Initial delay in controlling violence
• Army deployment only after several days
• Many accused of complicity were never prosecuted
• Calls for justice continued for decades

Aftermath:
• Mass displacement of Sikh families
• Trauma across generations
• Numerous commissions of inquiry
• Limited justice delivered
• 2015: "Never Ever We Forget Our Martyrs" memorial document released

International Recognition:
Various human rights organizations have characterized these events as genocide or crimes against humanity. The Sikh diaspora marks November 1984 annually as a period of remembrance.

Justice Movement:
Victims' families and human rights activists continue seeking justice. Several commissions have investigated, but accountability remains incomplete.

This dark chapter in Indian history serves as a reminder of the dangers of communal hatred and the importance of protecting minority rights.`,
    sources: [historicalSources.martyrs_1984, historicalSources.devgan_1984, historicalSources.nanavati_commission],
    relatedArticles: ['operation_bluestar', 'aftermath_1984', 'sikh_diaspora']
  },
  {
    id: 'aftermath_1984',
    title: 'Aftermath and Healing',
    titleGurmukhi: '1984 ਤੋਂ ਬਾਅਦ',
    period: '1984-Present',
    era: '1984',
    summary: 'The long-term impact of 1984 events and the community\'s journey toward healing and justice.',
    content: `The events of 1984 left deep scars on the Sikh community, with effects that continue to resonate today.

Immediate Aftermath (1984-1990s):
• Punjab under heavy military presence
• Thousands detained without trial
• Migration to other countries increased
• Community trust in government institutions damaged
• Insurgency period in Punjab (1984-1995)

Quest for Justice:
Multiple commissions were established:
• Mishra Commission (1985)
• Marwah Commission (1985)
• Jain-Banerjee Committee (1987)
• Nanavati Commission (2000-2005)

Despite investigations, few perpetrators faced consequences, leading to ongoing demands for justice.

Community Response:
Sikhs responded through:
• Legal advocacy and human rights documentation
• Memorial services and commemorations
• Educational initiatives about the events
• Political mobilization for accountability
• Reconciliation efforts

Healing Initiatives:
• Widow support programs
• Trauma counseling for survivors
• Youth education about history
• Interfaith dialogue
• Documentation projects like "Never Ever We Forget Our Martyrs"

Sikh Diaspora Impact:
The 1984 events significantly shaped Sikh diaspora identity:
• Increased emigration to Canada, UK, USA
• Strong advocacy for human rights
• Annual commemorations worldwide
• Political engagement in host countries
• Preservation of memory through digital means

Progress and Challenges:
Some progress has been made:
• Limited prosecutions of some perpetrators
• Government apologies (though considered inadequate by many)
• Compensation for victims (though many say insufficient)
• Greater awareness of the events

Ongoing challenges:
• Many perpetrators remain unpunished
• Full official acknowledgment still sought
• Generational trauma continues
• Political sensitivities around the topic

Path Forward:
The Sikh community has shown remarkable resilience:
• Continued contributions to Indian society
• Maintaining cultural and religious identity
• Advocating for justice peacefully
• Building bridges with other communities
• Ensuring younger generations know the history

The journey toward complete healing and justice continues, with the community balancing remembrance with hope for the future.`,
    sources: [historicalSources.martyrs_1984, historicalSources.devgan_1984, historicalSources.nanavati_commission, historicalSources.sikhs_outside_punjab],
    relatedArticles: ['operation_bluestar', 'anti_sikh_riots_1984', 'sikh_diaspora']
  },
  {
    id: 'sikh_diaspora',
    title: 'The Global Sikh Diaspora',
    titleGurmukhi: 'ਗਲੋਬਲ ਸਿੱਖ ਭਾਈਚਾਰਾ',
    period: '1900s-Present',
    era: 'modern',
    summary: 'The spread of Sikh communities across the world and their contributions to global society.',
    content: `Sikhs have established vibrant communities across the globe, making significant contributions while maintaining their distinct identity.

Major Sikh Populations:
• India: ~25-30 million (majority in Punjab)
• Canada: ~770,000 (2% of population)
• United Kingdom: ~520,000
• United States: ~500,000
• Australia: ~200,000
• Smaller communities in Southeast Asia, Middle East, Africa, Europe

Historical Migration Patterns:
Early Period (1900s-1940s):
• Labor migration to Canada, USA, UK
• Settlement in East Africa under British Empire
• Farming communities in California
• Railway workers in Canada

Post-Independence (1947-1980s):
• Migration following partition trauma
• Professional migration to Western countries
• Establishment of gurdwaras abroad

Post-1984 Wave:
• Significant migration following 1984 events
• Refugee status granted to many
• Family reunification programs

Contributions:
Economic:
• Successful in agriculture, trucking, technology, medicine
• Entrepreneurial ventures across sectors
• Significant remittances to Punjab

Political:
• Jagmeet Singh: Leader of Canada's NDP party
• Several MPs and local politicians globally
• Advocacy for human rights and religious freedom

Cultural:
• Gurdwaras serve as community centers
• Punjabi language preservation
• Sikh festivals celebrated publicly
• Interfaith engagement

Challenges:
• Maintaining identity in diverse societies
• Occasional discrimination and hate crimes
• Post-9/11 profiling (turban mistaken for extremism)
• Balancing tradition with integration

Community Strengths:
• Strong family values
• Community support systems
• Religious institutions (gurdwaras)
• Youth engagement programs
• Charitable work (seva tradition)

Notable Achievements:
• Harjit Sajjan: Canadian Defense Minister
• Sikhs in British, Canadian armies allowed to wear turbans
• Growing representation in Western politics and business
• Successful advocacy for religious rights

The Sikh diaspora remains connected to Punjab while being rooted in their adopted countries, creating a unique transnational identity that enriches both their homeland and host nations.`,
    sources: [historicalSources.sikhs_outside_punjab],
    relatedArticles: ['aftermath_1984']
  }
];

// History Eras/Categories
export const historyEras: HistoryEra[] = [
  {
    id: 'gurus',
    title: 'The Age of the Gurus',
    titleGurmukhi: 'ਗੁਰੂਆਂ ਦਾ ਯੁੱਗ',
    period: '1469-1708',
    description: 'The foundation of Sikhism through ten enlightened Gurus, from Guru Nanak Dev Ji to Guru Gobind Singh Ji, who established the core spiritual and temporal principles of the faith.',
    icon: '🙏',
    articles: ['guru_nanak_dev_ji', 'ten_gurus', 'guru_gobind_singh']
  },
  {
    id: 'warriors',
    title: 'The Warrior Era',
    titleGurmukhi: 'ਯੋਧਿਆਂ ਦਾ ਯੁੱਗ',
    period: '1708-1849',
    description: 'From Banda Singh Bahadur through the Misls to the mighty Sikh Empire under Maharaja Ranjit Singh - an era of valor, sovereignty, and military prowess.',
    icon: '⚔️',
    articles: ['banda_singh_bahadur', 'misl_period', 'sikh_empire', 'anglo_sikh_wars']
  },
  {
    id: 'modern',
    title: 'Modern Sikh History',
    titleGurmukhi: 'ਆਧੁਨਿਕ ਇਤਿਹਾਸ',
    period: '1849-1984',
    description: 'Sikhs under British rule, their role in India\'s independence, contributions to nation-building, and the Green Revolution that transformed Punjab.',
    icon: '🌾',
    articles: ['british_colonial_period', 'post_independence', 'sikh_diaspora']
  },
  {
    id: '1984',
    title: '1984 and Its Aftermath',
    titleGurmukhi: '1984 ਅਤੇ ਬਾਅਦ',
    period: '1984-Present',
    description: 'A painful chapter in Sikh history involving Operation Blue Star and subsequent violence. This section documents these tragic events and the ongoing quest for justice and healing.',
    icon: '🕊️',
    articles: ['operation_bluestar', 'anti_sikh_riots_1984', 'aftermath_1984']
  }
];
