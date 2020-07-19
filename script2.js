// 6881434cc6824c6d86651795a4eba775 = api key for covid news

new Vue({
  el: "#main",
  data: {
    panels: panels(),
    current_index: -1,
    time_height: 0,
    time_position: {
      top: 0,
    },
    transition: "in",
    current_month: [0, 0, 0],
    current_date: [0, 0],
    numbers: "0123456789".split(""),
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    display_day: "00",
    display_month: "JAN",
  },
  methods: {
    handleScroll: function (e) {
      let delta = e.deltaY;

      if (delta < 0 && this.current_index >= 0) {
        this.transition = "out";
        this.current_index--;
      }

      if (delta > 0 && this.current_index < this.panels.length - 1) {
        this.current_index++;
        this.transition = "in";
      }
    },
    getLineClass: function (index) {
      return {
        active: this.current_index == index,
        "pre-1": this.current_index - 1 == index,
        "post-1": this.current_index + 1 == index,
        "pre-2": this.current_index - 2 == index,
        "post-2": this.current_index + 2 == index,
        "pre-3": this.current_index - 3 == index,
        "post-3": this.current_index + 3 == index,
      };
    },
    onUpdateDays: function () {
      let days = [];

      for (var i = 0; i < this.current_date.length; i++) {
        const rand = this.numbers[
          Math.round(this.current_date[i]) % this.numbersLength
        ];
        days.push(rand);
      }
      this.display_day = days.join("");
    },
    onUpdateMonth: function () {
      let month = [];

      for (var i = 0; i < this.current_month.length; i++) {
        const rand = this.letters[
          Math.round(this.current_month[i]) % this.lettersLength
        ];
        month.push(rand);
      }
      this.display_month = month.join("");
    },
  },
  beforeMount: function () {
    var images = [];
    this.panels.forEach((p, i) => {
      if (p.hasOwnProperty("img")) {
        images[i] = new Image();
        images[i].src = p.img;
      }
    });
  },
  mounted: function () {
    const timeEl = this.$refs.time;
    this.time_height = timeEl.getBoundingClientRect().height;
  },
  computed: {
    getPosition: function () {
      let top = this.current_panel * -100;
      return {
        transform: `translateY(${top}vh)`,
      };
    },
    currentPanel: function () {
      if (this.current_index < 0) return {};

      return this.panels[this.current_index];
    },
    numbersLength: function () {
      return this.numbers.length;
    },
    lettersLength: function () {
      return this.letters.length;
    },
    wrapperStyle: function () {
      const top = this.current_index == -1 ? 0 : "-100%";
      return {
        transform: `translateY(${top})`,
      };
    },
  },
  watch: {
    current_index: {
      handler: function (newVal) {
        this.$nextTick(function () {
          const currentLine = this.$el.querySelector(
            `.line:nth-child(${newVal + 1})`
          );

          if (currentLine == null) return {};

          const dim = currentLine.offsetTop;
          const top = dim - this.time_height - this.time_height / 2;

          this.time_position = {
            top: `${top}px`,
          };

          let newDay = this.panels[this.current_index];
          this.current_date = [0, 0];
          this.current_month = [0, 0, 0];
          const splitDate = newDay.date.split(" ");
          const days = splitDate[0].split("");
          let month = splitDate[1].split("");
          month = month.map((m) => this.letters.indexOf(m.toUpperCase()));

          gsap.to(this.$data.current_date, {
            duration: 0.3,
            ease: Linear.easeNone,
            "0": this.numbersLength * 20 + days[0],
            "1": this.numbersLength * 60 + days[1],
            onUpdate: this.onUpdateDays,
          });

          gsap.to(this.$data.current_month, {
            duration: 0.3,
            ease: Linear.easeNone,
            "0": this.lettersLength * 20 + month[0],
            "1": this.lettersLength * 20 + month[1],
            "2": this.lettersLength * 20 + month[2],
            onUpdate: this.onUpdateMonth,
          });
        });
      },
    },
  },
});

function panels() {
  return [
    {
      date: "31 Dec",
      title:
        "Chinese authorities treated dozens of cases of pneumonia of unknown cause.",
      desc:
        'On Dec. 31, the<a href="https://www.nytimes.com/2020/01/06/world/asia/china-SARS-pneumonialike.html" title="" target="_blank"> government in Wuhan, China, confirmed</a> that health authorities were treating dozens of cases. Days later, researchers in China <a href="https://www.nytimes.com/2020/01/08/health/china-pneumonia-outbreak-virus.html" title="" target="_blank">identified a new virus</a> that had infected dozens of people in Asia. At the time, there was no evidence that the virus was readily spread by humans. Health officials in China said they were monitoring it to prevent the outbreak from developing into something more severe.',
    },
    {
      date: "11 Jan",
      title: "China reported its first death.",
      desc:
        'On Jan. 11, Chinese state media reported the <a href="https://www.nytimes.com/2020/01/10/world/asia/china-virus-wuhan-death.html" title="" target="_blank">first known death</a> from an illness caused by the virus, which had infected dozens of people. The 61-year-old man who died was a regular customer at the market in Wuhan, . The report of his death came just before one of China’s biggest holidays, when hundreds of millions of people travel across the country.',
    },
    {
      date: "20 Jan",
      title: "Other countries, including the United States, confirmed cases.",
      desc:
        'The first confirmed cases outside mainland China occurred in Japan, South Korea and Thailand, according to the W.H.O.’s first <a href="https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200121-sitrep-1-2019-ncov.pdf?sfvrsn=20a99c10_4" title="" rel="noopener noreferrer" target="_blank">situation report</a>. The first confirmed case in the United States came the next day in Washington State, where <a href="https://www.nytimes.com/2020/01/21/health/cdc-coronavirus.html" title="" target="_blank">a man in his 30s developed symptoms</a> after returning from a trip to Wuhan.',
    },
    {
      date: "23 Jan",
      title:
        "Wuhan, a city of more than 11 million, was cut off by the Chinese authorities.",
      desc:
        'The Chinese authorities<a class="css-1g7m0tk" href="https://www.nytimes.com/2020/01/22/world/asia/china-coronavirus-travel.html" title=""> closed off Wuhan</a> by canceling planes and trains leaving the city, and suspending buses, subways and ferries within it. At this point, at least 17 people had died and more than 570 others had been infected, including in Taiwan, Japan, Thailand, South Korea and the United States.',
      img:
        "https://static01.nyt.com/images/2020/02/11/multimedia/00xp-virustimeline4/merlin_168335142_4eca1f21-e21b-4b97-8b87-dad2489ee05b-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "30 Jan",
      title: "The W.H.O. declared a global health emergency.",
      desc:
        'Amid thousands of new cases in China, a “public health emergency of international concern” was officially <a href="https://www.nytimes.com/2020/01/30/health/coronavirus-world-health-organization.html" title="" target="_blank">declared </a>by the W.H.O. China’s Foreign Ministry spokeswoman said that it would continue to work with the W.H.O. and other countries to protect public health, and the U.S. <a href="https://www.nytimes.com/2020/01/30/world/asia/Coronavirus-travel-advisory-.html" title="" target="_blank">State Department warned</a> travelers to avoid China.',
    },
    {
      date: "31 Jan",
      title: "The Trump administration restricted travel from China",
      desc:
        'The Trump administration <a href="https://www.nytimes.com/2020/01/31/business/china-travel-coronavirus.html" title="" target="_blank">suspended entry</a> into the United States by any foreign nationals who had traveled to China in the past 14 days, excluding the immediate family members of American citizens or permanent residents. By this date, <a href="https://www.nytimes.com/2020/01/30/world/asia/coronavirus-china.html#link-6a63a9b7" title="" target="_blank">213 people had died</a> and nearly 9,800 had been infected worldwide.',
    },
    {
      date: "02 Feb",
      title: "The first coronavirus death was reported outside China.",
      desc:
        'A 44-year-old man in the Philippines <a href="https://www.nytimes.com/2020/02/02/world/asia/philippines-coronavirus-china.html" title="" target="_blank">died after being infected</a>, officials said, the first death reported outside China. By this point, more than 360 people had died.',
    },
    {
      date: "05 Feb",
      title: "A cruise ship in Japan quarantined thousands.",
      desc:
        'After a two-week trip to Southeast Asia, more than 3,600 passengers began a<a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/05/world/asia/japan-coronavirus-cruise-ship.html" title=""> quarantine</a> aboard the Diamond Princess cruise ship in Yokohama, Japan. Officials started screening passengers, and the number of people who tested positive became the largest number of coronavirus cases outside China. By Feb. 13, the number <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/12/travel/coronavirus-cruises-travel.html" title="">stood at 218</a>.',
      img:
        "https://static01.nyt.com/images/2020/03/22/multimedia/00xp-virustimeline6/merlin_168707022_c59b8a80-0fa2-43ab-b50c-8366f8c6f2b6-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "07 Feb",
      title: "A Chinese doctor who tried to raise the alarm died.",
      desc:
        'When <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/06/world/asia/chinese-doctor-Li-Wenliang-coronavirus.html" title="">Dr. Li Wenliang</a>, a Chinese doctor, <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/06/world/asia/chinese-doctor-Li-Wenliang-coronavirus.html" title="">died </a>after contracting the coronavirus, he was hailed as a hero by many for trying to ring early alarms that infections could spin out of control.',
      img:
        "https://static01.nyt.com/images/2020/02/12/multimedia/00xp-virustimeline5/merlin_168524808_e05e8362-bed5-446e-87ad-d3f03a5cd726-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "11 Feb",
      title: "The disease the virus causes was named.",
      desc:
        'The W.H.O. proposed an official name for the disease the virus coronavirus causes: <a href="https://www.nytimes.com/2020/02/11/world/asia/coronavirus-china.html?action=click&amp;module=Top%20Stories&amp;pgtype=Homepage" title="" target="_blank">Covid-19</a>, an acronym that stands for coronavirus disease 2019. The name makes no reference to any of the people, places, or animals associated with the coronavirus, given the goal to avoid stigma.',
    },
    {
      date: "14 Feb",
      title: "France announced the first coronavirus death in Europe.",
      desc:
        'An 80-year-old Chinese tourist <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/15/world/asia/coronavirus-china-live-updates.html?action=click&amp;module=Top%20Stories&amp;pgtype=Homepage#link-313a84de" title="">died on Feb. 14</a> at a hospital in Paris, in what was the first coronavirus death outside Asia, the authorities said. It was the fourth death from the virus outside mainland China, where about 1,500 people had died, most of them in Hubei Province.',
      img:
        "https://static01.nyt.com/images/2020/03/31/world/31xp-virustimeline1/31xp-virustimeline1-superJumbo-v2.jpg?quality=90&auto=webp",
    },
    {
      date: "19 Feb",
      title: "Hundreds left the quarantined cruise.",
      desc:
        'After a two-week quarantine, <a href="https://www.nytimes.com/2020/02/19/world/asia/china-coronavirus.html#link-4d20df2b" title="" target="_blank">443 passengers began leaving</a> the Diamond Princess cruise ship. It was the first day of a three-day operation to offload people who tested negative for the virus and did not have symptoms. Passengers who shared cabins with infected patients remained on the ship. At least 621 people aboard the ship were infected.',
    },
    {
      date: "21 Feb",
      title: "A secretive church was linked to the outbreak in South Korea.",
      desc:
        'Shincheonji Church of Jesus, <a href="https://www.nytimes.com/2020/02/21/world/asia/south-korea-coronavirus-shincheonji.html" title="" target="_blank">a secretive church</a> in South Korea was <a href="https://www.nytimes.com/2020/02/21/world/asia/china-coronavirus.html#link-6acdef1e" title="" target="_blank">linked to a surge of infections</a> in the country. The number of confirmed cases in the country rose above 200, and more than 400 other church members reported potential symptoms, health officials said.',
    },
    {
      date: "23 Feb",
      title: "Italy saw a major surge in cases.",
      desc:
        'Europe faced its <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/23/world/europe/italy-coronavirus.html" title="">first major outbreak</a> as the number of reported cases in Italy grew from fewer than five to more than 150. In the Lombardy region, officials locked down 10 towns after a cluster of cases suddenly emerged in Codogno, southeast of Milan. Schools closed and sporting and cultural events were canceled.',
      img:
        "https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline4/31xpvirustimeline4-superJumbo-v2.jpg?quality=90&auto=webp",
    },
    {
      date: "24 Feb",
      title: "Iran emerged as a second focus point.",
      desc:
        'Iran announced its first two coronavirus cases on Feb. 19. Less than a week later, the country said it had <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/24/world/asia/china-coronavirus.html#link-755cef26" title="">61 coronavirus cases</a> and 12 deaths, more than any other country at the time but China, and public health experts warned that Iran was a cause for worry — its borders are crossed each year by millions of religious pilgrims, migrant workers and others. Cases in Iraq, Afghanistan, Bahrain, Kuwait, Oman, Lebanon, the United Arab Emirates and one in Canada, have been traced back to Iran.',
      img:
        "https://static01.nyt.com/images/2020/02/24/business/00xp-virustimeline11/24china-briefing13-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "26 Feb",
      title: "Latin America reported its first case.",
      desc:
        'Brazilian <a href="https://www.nytimes.com/2020/02/26/world/americas/brazil-italy-coronavirus.html" title="" target="_blank">health officials</a> said that a 61-year-old São Paulo man, who had returned recently from a business trip to Italy, tested positive for the coronavirus. It was the first known case in Latin America. Officials also began tracking down other passengers on the flight the man took to Brazil and others who had contact with him in recent days.',
    },
    {
      date: "28 Feb",
      title: "Infections spiked in Europe.",
      desc:
        'Italy, where 800 people had been infected <a href="https://www.nytimes.com/2020/02/28/world/coronavirus-update.html#link-7f16f877" title="" target="_blank">by Feb. 28</a>, remained an area of concern. Cases in 14 other countries, including Northern Ireland and Wales, could be traced back to Italy. Germany had nearly 60 cases by Feb. 27, and France reported 57, more than triple the number from two days earlier. Both England and Switzerland reported additional cases, while Belarus, Estonia and Lithuania all reported their first infections.',
    },
    {
      date: "28 Feb",
      title: "Sub-Saharan Africa recorded its first infection.",
      desc:
        'Nigeria, Africa’s most populous nation, <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/28/world/coronavirus-update.html#link-7f16f877" title="">confirmed its first case</a> of coronavirus on Feb. 28. The patient was an Italian citizen who had returned to Lagos from Milan.',
      img:
        "https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline5/31xpvirustimeline5-superJumbo-v2.jpg?quality=90&auto=webp",
    },
    {
      date: "01 Mar",
      title: "The United States reported a death.",
      desc:
        'As the number of global cases rose to nearly 87,000, the Trump administration <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/02/29/world/coronavirus-news.html#link-63f783d3" title="">issued its highest-level warning</a>, known as a “do not travel” warning, for areas in Italy and South Korea most affected by the virus.',
    },
    {
      date: "03 Mar",
      title: "U.S. officials approved widespread testing.",
      desc:
        'The C.D.C. <a href="https://www.nytimes.com/2020/03/03/world/coronavirus-live-news-updates.html#link-79b1dbc8" title="" target="_blank">lifted all federal restrictions</a> on testing for the coronavirus on March 3, according to Vice President Mike Pence. The news came after the C.D.C.’s first attempt to produce a diagnostic test kit <a href="https://www.nytimes.com/2020/03/02/world/coronavirus-updates-news-covid-19.html" title="" target="_blank">fell flat</a>. By this point, the coronavirus had infected more than 90,000 around the globe and killed about 3,000, <a href="https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200303-sitrep-43-covid-19.pdf?sfvrsn=2c21c09c_2" title="" rel="noopener noreferrer" target="_blank">according to the W.H.O.</a>',
    },
    {
      date: "11 Mar",
      title: "President Trump blocked most visitors from continental Europe.",
      desc:
        'In a prime-time address from the Oval Office, President Trump said <a href="https://www.nytimes.com/2020/03/11/us/politics/anthony-fauci-coronavirus.html" title="" target="_blank">he would halt travelers from European countries </a>other than Britain for 30 days, as the W.H.O. declared the coronavirus a pandemic and stock markets plunged further.',
    },
    {
      date: "13 Mar",
      title: "President Trump declared a national emergency.",
      desc:
        'Mr. Trump officially<a class="css-1g7m0tk" href="https://www.nytimes.com/2020/03/13/world/coronavirus-news-live-updates.html#link-37509802" title=""> declared a national emergency</a>, and said he was making $50 billion in federal funds available to states and territories to combat the coronavirus. He also said he would give hospitals and doctors more flexibility to respond to the virus, including making it easier to treat people remotely.',
      img:
        "https://static01.nyt.com/images/2020/03/31/us/31xpvirustimeline2/31xpvirustimeline2-superJumbo-v2.jpg?quality=90&auto=webp",
    },
    {
      date: "15 Mar",
      title:
        "The C.D.C. recommended no gatherings of 50 or more people in the U.S.",
      desc:
        'The C.D.C. <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/03/15/world/coronavirus-live.html" title="">advised no gatherings</a> of 50 or more people in the United States over the next eight weeks. The recommendation included weddings, festivals, parades, concerts, sporting events and conferences. The following day, Mr. Trump advised citizens to <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/03/16/world/live-coronavirus-news-updates.html" title="">avoid groups</a> of more than 10. New York City’s public schools system, the nation’s largest with 1.1 million students, <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/03/15/nyregion/nyc-schools-closed.html" title="">announced that it would close</a>.',
      img:
        "https://static01.nyt.com/images/2020/04/13/us/politics/13xp-timeline-5/merlin_170701089_4f652274-b6d3-4b0e-9c96-0b016a11ec87-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "16 Mar",
      title: "Latin America began to feel the effects.",
      desc:
        'Several countries across Latin America <a href="https://www.nytimes.com/2020/03/16/world/live-coronavirus-news-updates.html" title="" target="_blank">imposed restrictions</a> on their citizens to slow the spread of the virus. Venezuela announced a nationwide quarantine that began on March 17. Ecuador and Peru implemented countrywide lockdowns, while Colombia and Costa Rica closed their borders. However, Jair Bolsonaro, the president of Brazil, encouraged mass demonstrations by his supporters against his opponents in congress.',
    },
    {
      date: "17 Mar",
      title: "France imposed a nationwide lockdown.",
      desc:
        'On March 17, France <a href="https://www.nytimes.com/2020/03/17/world/europe/paris-coronavirus-lockdown.html" title="" target="_blank">imposed a nationwide lockdown</a>, prohibiting gatherings of any size and postponing the second round its municipal elections. While residents were told to stay home, officials allowed people to go out for fresh air but warned that meeting a friend on the street or in a park would be punishable with a fine. By this time, France had more than 6,500 infections with more than 140 deaths, <a href="https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200317-sitrep-57-covid-19.pdf?sfvrsn=a26922f2_4" title="" rel="noopener noreferrer" target="_blank">according to the W.H.O.</a>',
    },
    {
      date: "17 Mar",
      title: "The E.U. barred most travelers from outside the bloc.",
      desc:
        'European leaders <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/03/17/world/europe/EU-closes-borders-virus.html" title="">voted to close off at least 26 countries</a> to nearly all visitors from the rest of the world for at least 30 days. The ban on nonessential travel from outside the bloc was the first coordinated response to the epidemic by the European Union.',
      img:
        "https://static01.nyt.com/images/2020/04/13/us/politics/13xp-virus-timeline-7/merlin_170722023_f98890be-c166-4ce2-8d3b-c30f2ecf9a2f-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "19 Mar",
      title: "For the first time, China reported zero local infections.",
      desc:
        'China reported <a href="https://www.nytimes.com/2020/03/18/world/asia/china-coronavirus-zero-infections.html" title="" target="_blank">no new local infections</a> for the previous day, a milestone in the ongoing fight against the pandemic. The news signaled that an end to China’s epidemic could be in sight.',
    },
    {
      date: "23 Mar",
      title: "Prime Minister Boris Johnson locked Britain down.",
      desc:
        'The lockdown<a href="https://www.nytimes.com/2020/03/23/world/europe/coronavirus-uk-boris-johnson.html" title="" target="_blank"> closed all nonessential shops</a>, barred meetings of more than two people, and required all people to stay in their homes except for trips for food or medicine. Those who disobey risked being fined by the police.',
    },
    {
      date: "24 Mar",
      title: "The Tokyo Olympics were delayed until 2021.",
      desc:
        'Officials announced that the <a href="https://www.nytimes.com/2020/03/24/sports/olympics/coronavirus-summer-olympics-postponed.html" title="" target="_blank">Summer Olympics in Tokyo would be postponed</a> for one year.<span class="css-8l6xbc evw5hdy0">  </span>Only three previous Games had been canceled, all because of war: in 1916, 1940 and 1944.',
    },
    {
      date: "24 Mar",
      title: "India announced a 21-day lockdown.",
      desc:
        'One day after the authorities halted all domestic flights, Narendra Modi, India’s prime minister, <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/03/24/world/asia/india-coronavirus-lockdown.html" title="">declared a 21-day lockdown</a>. While the number of reported cases in India was about 500, the prime minister pledged to spend about $2 billion on medical supplies, isolation rooms, ventilators and training for medical professionals.',
      img:
        "https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline6/31xpvirustimeline6-superJumbo-v2.jpg?quality=90&auto=webp",
    },
    {
      date: "26 Mar",
      title: "The United States led the world in confirmed cases.",
      desc:
        'The United States officially became the country <a href="https://www.nytimes.com/2020/03/26/health/usa-coronavirus-cases.html" title="" target="_blank">hardest hit by the pandemic</a>, with at least 81,321 confirmed infections and more than 1,000 deaths. This was more reported cases than in China, Italy or any other country at the time.',
    },
    {
      date: "27 Mar",
      title: "Trump signed a stimulus bill into law.",
      desc:
        'Mr. Trump <a href="https://www.nytimes.com/2020/03/27/us/politics/coronavirus-house-voting.html" title="" target="_blank">signed a $2 trillion measure</a> to respond to the coronavirus pandemic. Lawmakers said the bill, which passed with overwhelming support, was imperfect but essential to address the national public health and economic crisis.',
    },
    {
      date: "28 Mar",
      title: "The C.D.C. issued a travel advisory for the New York region.",
      desc:
        'The C.D.C. <a href="https://www.cdc.gov/media/releases/2020/s038-travel-advisory.html" title="" rel="noopener noreferrer" target="_blank">urged residents</a> of New York, New Jersey and Connecticut to “refrain from nonessential domestic travel for 14 days effective immediately.” The advisory did not apply to workers in “critical infrastructure industries,” including trucking, public health, financial services and food supply.',
    },
    {
      date: "30 Mar",
      title: "More states issued stay-at-home directives.",
      desc:
        'Virginia, Maryland and Washington, D.C., <a class="css-1g7m0tk" href="https://www.nytimes.com/interactive/2020/us/coronavirus-stay-at-home-order.html" title="">issued orders</a> requiring their residents to stay home. Similar orders went into effect for Kansas and North Carolina. Other states had previously put strict measures in place. The new orders meant that least 265 million Americans were being urged to stay home.',
      img:
        "https://static01.nyt.com/images/2020/03/23/us/coronavirus-stay-at-home-order-promo-1585014493943-copy/coronavirus-stay-at-home-order-promo-1585014493943-superJumbo-v20.png?quality=90&auto=webp",
    },
    {
      date: "02 Apr",
      title: "Cases topped one million, and millions lost their jobs.",
      desc:
        "By April 2, the pandemic had sickened more than one million people in 171 countries across six continents, killing at least 51,000.",
    },
    {
      date: "06 Apr",
      title: "Prime Minister Boris Johnson moved into intensive care.",
      desc:
        'Ten days <a href="https://twitter.com/BorisJohnson/status/1243496858095411200" title="" rel="noopener noreferrer" target="_blank">after going public</a> with his coronavirus diagnosis, Prime Minister Boris Johnson of Britain was <a href="https://www.nytimes.com/2020/04/06/world/europe/boris-johnson-coronavirus-hospital-intensive-care.html" title="" target="_blank">moved into intensive care</a>. The decision was a precaution, according to the British government, who also said he had been in good spirits. Mr. Johnson had also asked the foreign secretary, Dominic Raab, to deputize for him “where necessary.” He was released on April 12.',
    },
    {
      date: "08 Apr",
      title: "Companies planned vaccine trials.",
      desc:
        'At least two dozen companies have announced <a href="https://www.nytimes.com/2020/04/08/health/coronavirus-vaccines.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">vaccine programs</a> aimed at ending the pandemic, including Novavax, a Maryland-based biotech firm that said it would begin human trials in Australia in mid-May. Johnson &amp; Johnson plans to start clinical trials in September, Moderna began a clinical trial for its vaccine in March, and Inovio Pharmaceuticals injected its trial vaccine into the first volunteers in April.',
    },
    {
      date: "10 Apr",
      title: "Cases surged in Russia.",
      desc:
        'The number of people hospitalized in Moscow with Covid-19 <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/04/10/world/europe/coronavirus-russia-moscow-putin.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="">doubled from the previous week</a>, with two-thirds of the country’s 12,000 reported cases in Moscow. The increase in cases pushed Moscow’s health care system to its limit, well before an expected peak.',
      img:
        "https://static01.nyt.com/images/2020/04/10/world/10virus-moscow-copy/merlin_171261144_da859ea1-d1e2-4f58-998e-ad284405c998-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "14 Apr",
      title: "The global economy slid toward contraction.",
      desc:
        'The International Monetary Fund warned that the global economy was <a href="https://www.nytimes.com/2020/04/14/us/politics/coronavirus-economy-recession-depression.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">headed for its worst downturn</a> since the Great Depression. The organization predicted the world economy would contract by 3 percent in 2020, a reversal from its forecast early this year that the world economy would grow by 3.3 percent.',
    },
    {
      date: "17 Apr",
      title:
        "President Trump encouraged protests against some state restrictions.",
      desc:
        'In a series of all-cap tweets, Mr. Trump <a href="https://www.nytimes.com/2020/04/17/us/politics/trump-coronavirus-governors.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">encouraged</a> right-wing protests of social distancing restrictions in some states. His call followed protests in Michigan, Minnesota and Ohio where protesters — many wearing red “Make America Great Again” hats — congregated in packed groups around state capitols to demand that restrictions be lifted and to demonize their governors.',
    },
    {
      date: "21 Apr",
      title:
        "Officials discovered earlier known U.S. coronavirus deaths in California.",
      desc:
        'Officials in Santa Clara County, Calif., announced that two residents there died of the coronavirus on Feb. 6 and Feb. 17, making them <a href="https://www.nytimes.com/2020/04/22/us/coronavirus-first-united-states-death.html" title="" target="_blank">the earliest known</a><a href="https://www.nytimes.com/2020/02/29/us/coronavirus-washington-death.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank"> victims</a> of the pandemic in the United States. The new information, gained from autopsies of the residents, moved the timeline of the virus’s spread in country weeks earlier than previously understood. .',
    },
    {
      date: "24 Apr",
      title:
        "The European Union, pressured by China, watered down a report on disinformation.",
      desc:
        'The E.U. appeared to succumb to pressure from Beijing and softened criticism of China <a href="https://www.nytimes.com/2020/04/24/world/europe/disinformation-china-eu-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">in a report on disinformation </a>about the coronavirus pandemic. While the initial report was not particularly harsh, European officials delayed and then rewrote the document to dilute the focus on China, a vital trading partner.',
    },
    {
      date: "24 Apr",
      title: "The president was criticized over disinfectant comments.",
      desc:
        'After Mr. Trump at a White House briefing suggested that an “injection inside” the human body with a disinfectant like bleach or isopropyl alcohol could help combat the virus, the makers of <a href="https://www.nytimes.com/2020/04/24/us/politics/trump-inject-disinfectant-bleach-coronavirus.html" title="" target="_blank">Clorox and Lysol pleaded with Americans</a> not to ingest their products.',
    },
    {
      date: "26 Apr",
      title: "The global death toll surpassed 200,000.",
      desc:
        'By April 26, the coronavirus pandemic had killed more than 200,000 people and sickened more than 2.8 million worldwide, according to data <a class="css-1g7m0tk" href="https://www.nytimes.com/interactive/2020/world/coronavirus-maps.html" title="">collected by The New York Times</a>. The actual toll is higher by an unknown degree, and will remain so for some time.',
      img:
        "https://static01.nyt.com/images/2020/06/13/us/13xp-virustimeline-death/merlin_171993099_5540e16f-b69f-4b3d-bc92-71bb5fff4de7-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "30 Apr",
      title: "Airlines announced rules requiring face masks.",
      desc:
        'American Airlines and Delta Air Lines said they would require all passengers and flight attendants <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/04/30/business/airlines-masks-coronavirus-passengers.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="">to wear a face covering</a>. Lufthansa Group — which owns Lufthansa, Swiss International Air Lines and Austrian Airlines — as well as JetBlue and Frontier Airlines had made similar announcements.',
      img:
        "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-mask/merlin_172209270_51e33667-edaa-4e73-8ba7-8677dce93320-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "01 May",
      title:
        "The W.H.O. extended its declaration of a global public health emergency.",
      desc:
        'On May 1, The W.H.O. <a href="https://www.nytimes.com/2020/05/01/health/coronavirus-who-emergency.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">extended its declaration</a> of a global health emergency, amid increasing criticism from the Trump Administration about its handling of the pandemic. The move came three months after the W.H.O. announced a “public health emergency of international concern” on Jan. 30.',
    },
    {
      date: "03 May",
      title: "Several countries targeted China over the coronavirus. ",
      desc:
        'A <a href="https://www.nytimes.com/2020/05/03/world/europe/backlash-china-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">backlash was building against China</a> for its initial mishandling of the crisis. Australia called for an inquiry into the origins of the virus. In Britain and Germany, new questions were raised about the advisability of using the Chinese tech giant Huawei for new 5G systems. Mr. Trump continued to blame China for the outbreak and sought ways to punish it.',
    },
    {
      date: "05 May",
      title:
        "The coronavirus reached France in December, doctors said, rewriting the epidemic’s timeline.",
      desc:
        'French doctors said that they had discovered that a patient treated for pneumonia in late December had the coronavirus. If the diagnosis is verified, it would suggest that the virus <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/05/05/world/europe/france-coronavirus-timeline.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="">appeared in Europe nearly a month earlier</a> than previously understood and days before Chinese authorities first reported the new illness to the World Health Organization. The first report of an infection in Europe was on Jan. 24 in France.',
      img:
        "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-france/13xp-virustimeline-france-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "10 May",
      title: "The British prime minister relaxed certain restrictions. ",
      desc:
        'In a national address, Boris Johnson said that <a href="https://www.nytimes.com/2020/05/10/world/europe/coronavirus-britain-boris-johnson.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">Britain would impose a mandatory quarantine</a> on travelers arriving in the county by air in order to dodge a new wave of infections. He also urged the British public to “stay alert” and said that people could exercise outside as much as they wanted, sunbathe in parks, and return to work, if they could not work from home. Mr. Johnson’s blueprint to reopen Britain <a href="https://www.nytimes.com/2020/05/11/world/europe/coronavirus-uk-boris-johnson.html" title="" target="_blank">was met with confusion and criticism.</a> ',
    },
    {
      date: "13 May",
      title: "A top W.H.O. official said the coronavirus ‘may never go away.’",
      desc:
        'Dr. Mike Ryan, the head of the W. H. O.’s health emergencies program, <a href="https://twitter.com/WHO/status/1260591340393357312" title="" rel="noopener noreferrer" target="_blank">said the virus</a> may become “just another endemic virus in our communities, and this virus may never go away.” He also tamped down expectations that the invention of a vaccine would provide a quick and complete end to the global crisis.',
    },
    {
      date: "16 May",
      title: "Barack Obama criticized the U.S.’s virus response.",
      desc:
        'In a virtual commencement speech to thousands of graduates of historically black colleges and universities, former President Barack Obama<a href="https://www.nytimes.com/2020/05/16/us/barack-obama-2020-commencement-graduation-speech.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank"> pointedly criticized</a> the government’s handling of the crisis. “This pandemic has fully, finally torn back the curtain on the idea that so many of the folks in charge know what they’re doing,” he said. “A lot of them aren’t even pretending to be in charge.” ',
    },
    {
      date: "17 May",
      title:
        "Japan and Germany, two of the world’s largest economies, enter recessions.",
      desc:
        'Japan, the world’s third-largest economy after the United States and China, <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/05/17/business/japan-recession-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="">fell into a recession</a> for the first time since 2015. Its economy shrank by an annualized rate of 3.4 percent in the first three months of the year. ',
      img:
        "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-germany/13xp-virustimeline-germany-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "19 May",
      title: "Cambridge announces it will go online.",
      desc:
        'Cambridge University, an 800-year-old institution in England, said it would <a href="https://www.nytimes.com/2020/05/19/world/europe/cambridge-university-coronavirus.html" title="" target="_blank">move all student lectures online</a> for the upcoming academic year, underscoring how universities around the globe are scrambling to make adjustments. In the United States, some schools are planning to test and track infections. California State University, the nation’s largest four-year public university system, <a href="https://www.nytimes.com/2020/05/12/us/cal-state-online-classes.html" title="" target="_blank">said classes would take place</a> almost exclusively online in the fall.',
    },
    {
      date: "21 May",
      title: "Reported coronavirus cases top 5 million worldwide. ",
      desc:
        "By this date, more than five million people worldwide had contracted the coronavirus, according to data compiled by The New York Times. The rising figure, which passed four million less than two weeks earlier, reflected not just the virus’s spread but also an increase in testing.",
    },
    {
      date: "22 May",
      title: "Infections in Latin America continue to rise.",
      desc:
        'On May 22, Brazil overtook Russia in reporting the second-highest count of infections worldwide, reaching more than 330,000. Peru and Chile ranked among the hardest-hit countries in the world in terms of infections per capita, around 1 in 300. Data from Ecuador indicated that it was suffering <a class="css-1g7m0tk" href="https://www.nytimes.com/2020/04/23/world/americas/ecuador-deaths-coronavirus.html" title="">one of the worst outbreaks in the world</a>. The United States remained the global epicenter, with more than 1.6 million cases and the number of deaths nearing 100,000. ',
      img:
        "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-latin-america/merlin_172837227_62535589-cc2e-46d6-b704-ee40b964ef5b-superJumbo.jpg?quality=90&auto=webp",
    },
    {
      date: "27 May",
      title: "Coronavirus deaths in the U.S. surpassed 100,000.",
      desc:
        'Four months after the government confirmed the first known case, <a href="https://www.nytimes.com/interactive/2020/05/24/us/us-coronavirus-deaths-100000.html" title="" target="_blank">more than 100,000 people</a> who had the coronavirus were recorded dead in the United States. The death toll was far higher than in any other nation around the world.',
    },
    {
      date: "29 May",
      title: "India lifted lockdown as its cases skyrocket.",
      desc:
        "More than two months after India went into one of the world’s most severe lockdowns, the country moved to ease restrictions. Experts feared it was the worst timing: Infections were increasing quickly, including among migrant workers, leading to outbreaks in villages across Northern India. Almost half of the country’s 160,000 known cases had been traced to just four cities: New Delhi, Chennai, Ahmedabad and Mumbai, where hospitals had been overwhelmed.",
    },
    {
      date: "29 May",
      title: "President Trump said the U.S. would leave the W.H.O.",
      desc:
        'After accusing the W.H.O. of helping the Chinese government cover up the early days of the coronavirus pandemic in China, Mr. Trump <a href="https://www.nytimes.com/2020/05/29/health/virus-who.html" title="" target="_blank">said the United States would terminate</a> its relationship with the agency.<span class="css-8l6xbc evw5hdy0">  </span>Mr. Trump took no responsibility for the deaths of 100,000 Americans from the virus, instead saying that<span class="css-8l6xbc evw5hdy0">  </span>China had “instigated a global pandemic.”',
    },
    {
      date: "31 May",
      title: "Large protests drove concerns about new infections.",
      desc:
        'Mass protests over police violence against black Americans, in the wake of <a href="https://www.nytimes.com/2020/05/27/us/george-floyd-minneapolis-death.html" title="" target="_blank">George Floyd’s death</a> in custody of the Minneapolis Police, spurred concerns that the gatherings <a href="https://www.nytimes.com/2020/05/31/health/protests-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">could lead to new outbreaks.</a> By May 31, there had been protests in at least 75 U.S. cities.',
    },
    {
      date: "04 Jun",
      title: "Coronavirus tore into regions previously spared.",
      desc:
        'The number of known cases across the globe grew faster than ever, <a href="https://www.nytimes.com/2020/06/04/world/middleeast/coronavirus-egypt-america-africa-asia.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article" title="" target="_blank">with more than 100,000 new infections a day</a>. Densely populated, low- and middle-income countries across the Middle East, Latin America, Africa and South Asia were hit the hardest, suggesting bad news for strongmen and populists who once reaped political points by vaunting low infection rates as evidence of their leadership’s virtues.',
    },
    {
      date: "05 Jun",
      title: "China warns against travel in Australia.",
      desc:
        'In an announcement, the <a href="https://www.mct.gov.cn/zxbs/cxts/202006/t20200605_854150.htm" title="" rel="noopener noreferrer" target="_blank">Chinese Ministry of Culture and Tourism said</a> that “racial discrimination and violence against Chinese and Asians in Australia has increased significantly.” The notice followed a series of economic punishments by China against Australia, after Australian officials led a call for an independent investigation into the spread of the coronavirus. ',
    },
    {
      date: "09 Jun",
      title:
        "Moscow ends lockdown as it reports 1,000 daily new coronavirus cases.",
      desc:
        'Moscow’s lockdown ended on June 9 as a nationwide vote on extending President Vladimir V. Putin’s rule loomed, and as the city reported more than 1,000 daily new cases. Barbershops, beauty salons and other businesses were allowed to reopen. One day before the lockdown was lifted, Mayor Sergei S. Sobyanin said the <a href="https://www.nytimes.com/2020/05/11/world/europe/coronavirus-deaths-moscow.html" title="" target="_blank">spread of the coronavirus in the capita</a>l had slowed and that the city’s shelter-in-place measures, some of the world’s most stringent outside of China, could be lifted.',
    },
    {
      date: "11 Jun",
      title: "Coronavirus cases in Africa top 200,000.",
      desc:
        'The W.H.O. said that it took Africa 98 days to reach 100,000 coronavirus cases, but only <a href="https://news.un.org/en/story/2020/06/1066142" title="" rel="noopener noreferrer" target="_blank">18 days for that figure to double</a>. While the sharp rise in cases could be explained by an increase in testing, the agency said, more than half of the 54 countries on the continent were experiencing community transmissions. Ten countries were driving the rise in numbers and accounted for nearly 80 percent of all cases. South Africa has a quarter of the total cases.',
    },
    {
      date: "13 Jun",
      title: "Outbreak levels in Brazil and India reach new highs.",
      desc:
        "By June 13, Brazil ranked second worldwide for coronavirus deaths, with 41,828, below the U.S. death toll of 115,136. India also overtook Britain as the nation with the fourth-highest number of cases worldwide. There have been at least 308,900 confirmed cases confirmed infections in India and 8,884 deaths.",
    },
    {
      date: "16 Jun",
      title:
        "New Zealand records new cases after 24-day streak without infections.",
      desc:
        "A week after declaring the coronavirus pandemic eradicated, New Zealand authorities confirmed on June 16 two new cases of the coronavirus in travelers who had returned from Britain. The announcement ended the country’s 24-day streak without new infections.",
    },
    {
      date: "16 Jun",
      title:
        "Scientists find drug proven to reduce coronavirus-related deaths.",
      desc:
        'Scientists at the <a href="https://www.nytimes.com/2020/06/16/world/europe/dexamethasone-coronavirus-covid.html" title="" target="_blank">University of Oxford said</a> that they had identified what they called the first drug proven to reduce coronavirus-related deaths. A 6,000-patient trial of dexamethasone, a low-cost steroid, showed that it could reduce deaths of some hospitalized patients. Dexamethasone reduced deaths by a third in patients receiving ventilation, and by a fifth in patients receiving only oxygen treatment, the scientists said.',
    },
  ];
}