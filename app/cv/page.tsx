import {
  Box,
  Container,
  Divider,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
  Image,
  ListIcon,
  Link,
  HeadingProps,
} from '@chakra-ui/react'
import {
  Email,
  GitHub,
  GoogleMaps,
  Linkedin,
  Website,
} from '@/components/contact'
import { DataDefinition, SectionHeading } from '@/components/typography'
import { AtSignIcon, CalendarIcon } from '@/components/icons'
import { ReactNode } from 'react'
import './page.css'

function MuteHeading(props: HeadingProps) {
  return (
    <Heading
      as="h3"
      size="md"
      color="gray.600"
      _dark={{ color: 'gray.400' }}
      fontWeight="normal"
      {...props}
    />
  )
}

function HeaderSection() {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing="sm">
      <Box flex={1} mb={4}>
        <Heading as="h1" size="2xl">
          Alex Haslehurst
        </Heading>
        <Heading
          as="p"
          size="md"
          fontWeight="normal"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
        >
          Software Developer
        </Heading>
      </Box>
      <Box>
        <List color="gray.600" _dark={{ color: 'gray.400' }}>
          <ListItem>
            <Email />
          </ListItem>
          <ListItem>
            <Website />
          </ListItem>
          <ListItem>
            <GitHub />
          </ListItem>
          <ListItem>
            <Linkedin />
          </ListItem>
          <ListItem>
            <GoogleMaps />
          </ListItem>
        </List>
      </Box>
    </Stack>
  )
}

function BlurbSection() {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing="sm"
      alignItems="center"
    >
      <Box id="mugshot" px={{ base: 2, md: 4 }} mb={{ base: 4, md: 0 }}>
        <Image
          borderRadius="full"
          boxSize={{ base: 75, sm: 100, md: 150 }}
          src="/mugshot.png"
          alt="Alex"
        />
      </Box>
      <Box flex={1} px={4}>
        Hi, I&apos;m Alex, a software developer with over 10 years experience
        across many industries, platforms and within government. I have led
        multiple teams and delivered many full stack projects from design to
        production. I have a strong background in mathematics, statistics and
        data science, which has accelerated my career through some really
        interesting and complex projects. Most of all, I enjoy designing simple,
        scalable solutions to complex problems in an agile team. I like wearing
        shorts, running and retro gaming. I have over 650 stars on GitHub.
      </Box>
    </Stack>
  )
}

function TechnologiesSection() {
  return (
    <>
      <SectionHeading>Technologies</SectionHeading>

      <Text mb={3}>
        I like working with anything that has decent documentation, but I have
        most experience with:
      </Text>

      <DataDefinition
        title="JDK"
        value="Kotlin, Java, Scala, Clojure, http4k, Ktor, Spring, Hibernate, Gradle, Maven"
      />
      <DataDefinition
        title=".NET"
        value="C#, .NET Core, .NET Framework, EntityFramework, ASP.NET, VB, WCF, MVC"
      />
      <DataDefinition title="Node.js" value="Typescript, Nest.js" />
      <DataDefinition
        title="UI"
        value="React, Next.js, Angular, Vue.js, Android, iOS, legacy browser support, JQuery, GDS (gov.uk), Redux"
      />
      <DataDefinition
        title="Cloud"
        value="AWS, Lambda, Serverless, SAM, Terraform, RDS, EKS, DynamoDB"
      />
      <DataDefinition title="Devops" value="Kubernetes, Rancher, Docker" />
      <DataDefinition
        title="Database"
        value="Postgres, MySQL, SQL Server, Oracle, MongoDB"
      />
      <DataDefinition
        title="Big data"
        value="Cassandra, Kafka, Spark, Datastax Enterprise"
      />
    </>
  )
}

function Experience({
  title,
  url,
  place,
  date,
  tech,
  children,
}: {
  title: string
  place: string
  url?: string
  date: string
  tech?: string
  children: ReactNode
}) {
  return (
    <Box mb={8}>
      <MuteHeading>{title}</MuteHeading>
      <List
        spacing={0}
        fontSize="sm"
        mb={2}
        color="gray.600"
        _dark={{ color: 'gray.200' }}
        stylePosition="outside"
      >
        <ListItem>
          <ListIcon as={AtSignIcon} />
          {url ? (
            <Link href={url} isExternal variant="">
              {place}
            </Link>
          ) : (
            <>{place}</>
          )}
        </ListItem>
        <ListItem>
          <ListIcon as={CalendarIcon} />
          {date}
        </ListItem>
      </List>
      {tech && (
        <Text
          fontSize="sm"
          color="gray.600"
          _dark={{ color: 'gray.200' }}
          mb={2}
        >
          {tech}
        </Text>
      )}
      <Text>{children}</Text>
    </Box>
  )
}

function ExperienceSection() {
  return (
    <>
      <SectionHeading>Experience</SectionHeading>

      <Experience
        title="Software Developer (Contract)"
        place="JUXT"
        url="https://www.juxt.pro/"
        date="FEB 2022 - PRESENT"
        tech="Kotlin, Clojure, Java, Kubernetes, Oracle, ScyllaDB"
      >
        I am currently working a software development contract for a tier one
        banking client.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="Ministry of Justice"
        url="https://mojdigital.blog.gov.uk/"
        date="FEB 2021 - FEB 2022"
        tech="Kotlin, Java, Spring, Node.js, Typescript, Nest.js, AWS, Terraform, Kubernetes, GDS, Oracle"
      >
        I joined MoJ digital looking to broaden my experience of working with
        enterprise scale applications having thousands of users with diverse
        accessibility needs. I assumed technical lead on multiple projects,
        which were released through alpha, beta and live phases. I have
        integrated modern, cloud based microservices with legacy monolithic
        applications and supported a general strategy for modern platform
        migration. Much of my work is available publicly on GitHub.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="Inpart"
        url="https://inpart.io/"
        date="JAN 2020 - FEB 2021"
        tech="Node.js, React, Next.js, AWS, Terraform, Serverless, Rancher, OIDC, MySQL"
      >
        Inpart provides a digital partnering platform connecting university
        research with industry R&D. Virtually all technology at Inpart was new
        to me in a commercial context so I valued my time at Inpart as a
        challenge and learning experience. I assumed leadership in security,
        serverless and big data.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="Westfield Health"
        url="https://www.westfieldhealth.com/"
        date="JAN 2018 - JAN 2020"
        tech=".NET, Angular, Vue.js, JQuery, AWS, Terraform, Rancher, Android, iOS"
      >
        Westfield Health is a not-for-profit provider of contributory health
        schemes and health & wellbeing services. I joined them to help migrate
        their legacy business processes online. I provided technical leadership
        for a feature team responsible for multiple microservices and the
        ownership of their domain. I also led decisions that directed the
        platform as a whole and distributed libraries, processes and training to
        build conformance across all teams. I became the primary contact and
        technical owner for all things security, platform, serverless, UX/client
        technologies and mobile development.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="t-mac Technologies"
        url="https://t-mac.co.uk/"
        date="NOV 2015 - JAN 2018"
        tech="Scala, Spark, Cassandra, Kafka, .NET, Angular, JQuery, MongoDB, MS Sql Server, Docker Swarm"
      >
        At t-mac, I provided technical leadership for a big data focussed team
        responsible for processing IoT time series data at scale, presenting
        analytics onto customer dashboards and providing automated insights into
        portfolio performance. I led the project to architect the platform that
        supported all of this, which was built from technologies such as
        Cassandra, Spark and Kafka. I used primarily Scala based JDK software to
        deploy a mixture of custom and off-the-shelf machine learning algorithms
        at scale. I also worked on a modern microservice stack including .NET
        Core on Docker Swarm and Angular on the front end.
      </Experience>

      <Experience
        title="Software Developer"
        place="Alpharooms"
        date="MAR 2014 - NOV 2015"
        tech=".NET, MongoDB, AWS, JQuery"
      >
        Alpharooms was an online travel agent with a stack built on .NET
        Framework, SQL Server and MongoDB. Major challenges were operating
        efficiently at scale on AWS, maintaining SEO performance, managing
        asynchronous, external processes at scale and presenting everything with
        a UX aligned to maximising revenue.
      </Experience>

      <Experience
        title="Software Engineer"
        place="Technolog"
        url="https://www.technolog.com/"
        date="DEC 2012 - MAR 2014"
        tech="Java, Spring, Swing, .NET, C++, Cassandra, Oracle, JQuery"
      >
        I took my first software development job in a multi-disciplined team at
        Technolog, an electronics manufacturer in the utilities industry. I
        worked primarily with software supporting IoT data.
      </Experience>

      <Experience
        title="Statistical Analyst"
        place="Experian"
        url="https://www.experian.co.uk/"
        date="JUL 2010 - DEC 2012"
      >
        I started my career as an Analyst at Experian Decision Analytics. At
        Experien I realised that what little software development I was
        responsible for was what kept me driven and set me apart from my peers.
      </Experience>
    </>
  )
}

function SkillsSection() {
  return (
    <>
      <SectionHeading>Skills</SectionHeading>

      <MuteHeading>Architecture</MuteHeading>
      <Text mb={3}>
        I am a tech leader, I have designed, lead and delivered many successful
        projects on modern and legacy infrastructure.
      </Text>

      <MuteHeading>Code</MuteHeading>
      <Text mb={3}>
        I like to diversify my platform experience but no mater the idioms; I
        build simple solutions to complex problems with a TDD methodology.
      </Text>

      <MuteHeading>Agile</MuteHeading>
      <Text mb={3}>
        I prefer the agile approach to minimising project risk of aiming for
        smaller releases on a frequent, regular cadence. I will build tooling,
        processes and team culture to achieve this.
      </Text>

      <MuteHeading>Cloud</MuteHeading>
      <Text mb={3}>
        I have designed and developed cloud native applications at scale.
        I&apos;m happy to work with any public cloud, infrastructure as code and
        serverless application framework.
      </Text>

      <MuteHeading>UI</MuteHeading>
      <Text mb={3}>
        I understand how UX & consistent styling should work on a modern UI. I
        have worked with massive & complex UIs on top of many frameworks but
        prefer to keep greenfield work as simple and close to standard web
        technologies as possible.
      </Text>

      <MuteHeading>Analytics</MuteHeading>
      <Text mb={3}>
        I have developed machine learning at scale with open source tools. My
        strong background in statistics means I am equally confident in the
        development of custom algorithms as I am with dropping in off-the-shelf
        solutions.
      </Text>

      <MuteHeading>Big data</MuteHeading>
      <Text mb={3}>
        I have lead projects moving massive databases into modern scalable
        platforms.
      </Text>

      <MuteHeading>Security</MuteHeading>
      <Text mb={3}>
        I have experience deploying enterprise single-sign-on across legacy,
        modern and third party platforms.
      </Text>

      <MuteHeading>Legacy</MuteHeading>
      <Text mb={3}>
        Most software will eventually become legacy. I have tons of experience
        maintaining a legacy estate whilst strangling features into modern apps.
      </Text>

      <MuteHeading>Government</MuteHeading>
      <Text mb={3}>
        I have a high level of government clearance, please contact me for
        details. I have extensive experience with GDS and gov.uk UI development.
      </Text>
    </>
  )
}

function EducationSection() {
  return (
    <>
      <SectionHeading>Education</SectionHeading>

      <Experience
        title="Mathematics (1st Class Hons)"
        place="Sheffield Hallam University"
        url="https://shu.ac.uk/"
        date="SEP 2006 - JUL 2010"
      >
        Including self enrolled placement year at Experian Decision Analytics.
        Received an award for my outstanding achievement and had my final year
        project, a machine learning piece, exhibited at the university.
      </Experience>
    </>
  )
}

function Footer() {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      justifyContent="space-around"
      color="gray.600"
      _dark={{ color: 'gray.400' }}
    >
      <Email />
      <Website />
      <GitHub />
      <Linkedin />
    </Stack>
  )
}

export default function Cv() {
  return (
    <Container as="main" my={4}>
      <Box
        id="cv"
        overflow="hidden"
        p={{ base: 8, md: 12 }}
        boxShadow="0 1rem 3rem rgba(0,0,0,.2)"
        bg="gray.50"
        _dark={{ bg: 'gray.800', boxShadow: '0 1rem 3rem rgba(0,0,0,.4)' }}
      >
        <HeaderSection />
        <Divider my={10} />

        <BlurbSection />
        <Divider my={10} />

        <TechnologiesSection />
        <Divider my={10} />

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={{ base: 0, lg: 8 }}
        >
          <Box flex="1.75 1 0">
            <ExperienceSection />
            <Divider my={10} display={{ lg: 'none' }} />
          </Box>
          <Box flex="1 1 0">
            <SkillsSection />
            <Divider my={10} />

            <EducationSection />
          </Box>
        </Stack>
        <Divider my={10} />

        <Footer />
      </Box>
    </Container>
  )
}
