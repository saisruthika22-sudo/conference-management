import { Paper, PaperStatus, User, UserRole, ConferenceSession } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Dr. Jane Smith',
  email: 'jane.smith@confai.com',
  role: UserRole.CHAIR,
  avatar: 'https://picsum.photos/100/100'
};

export const MOCK_PAPERS: Paper[] = [
  {
    id: 'p1',
    title: 'Generative AI in Education: A Comprehensive Study',
    abstract: 'This paper explores the impact of large language models on undergraduate computer science education, focusing on code generation tools and their effect on problem-solving skills.',
    authors: ['Alice Johnson', 'Bob Doe'],
    track: 'AI in Education',
    status: PaperStatus.UNDER_REVIEW,
    submittedAt: '2023-10-15',
    reviews: []
  },
  {
    id: 'p2',
    title: 'Optimizing Neural Networks for Edge Devices',
    abstract: 'We propose a novel quantization technique that reduces model size by 40% while maintaining 98% accuracy on standard benchmarks, suitable for IoT deployment.',
    authors: ['Charlie Brown'],
    track: 'Edge Computing',
    status: PaperStatus.ACCEPTED,
    submittedAt: '2023-10-10',
    reviews: []
  },
  {
    id: 'p3',
    title: 'Sustainable Cloud Architectures',
    abstract: 'An analysis of energy consumption in modern data centers with proposed scheduling algorithms to maximize renewable energy usage.',
    authors: ['Diana Prince', 'Bruce Wayne'],
    track: 'Cloud Computing',
    status: PaperStatus.SUBMITTED,
    submittedAt: '2023-10-20',
    reviews: []
  }
];

export const MOCK_SESSIONS: ConferenceSession[] = [
  {
    id: 's1',
    title: 'Keynote: The Future of AI',
    startTime: '09:00',
    endTime: '10:00',
    room: 'Grand Hall',
    paperIds: [],
    day: 'Day 1'
  },
  {
    id: 's2',
    title: 'Track A: Machine Learning Applications',
    startTime: '10:30',
    endTime: '12:00',
    room: 'Room 101',
    paperIds: ['p1', 'p2'],
    day: 'Day 1'
  },
  {
    id: 's3',
    title: 'Track B: Systems & Infrastructure',
    startTime: '10:30',
    endTime: '12:00',
    room: 'Room 102',
    paperIds: ['p3'],
    day: 'Day 1'
  },
  {
    id: 's4',
    title: 'Morning Workshop: NLP Hands-on',
    startTime: '09:00',
    endTime: '12:00',
    room: 'Lab 3',
    paperIds: [],
    day: 'Day 2'
  },
  {
    id: 's5',
    title: 'Panel Discussion: Ethics in AI',
    startTime: '13:00',
    endTime: '14:30',
    room: 'Grand Hall',
    paperIds: [],
    day: 'Day 2'
  },
  {
    id: 's6',
    title: 'Closing Ceremony & Awards',
    startTime: '15:00',
    endTime: '16:00',
    room: 'Grand Hall',
    paperIds: [],
    day: 'Day 2'
  }
];