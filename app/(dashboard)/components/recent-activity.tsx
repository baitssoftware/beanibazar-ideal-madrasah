import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
  {
    user: 'Sarah Johnson',
    action: 'updated the Science syllabus',
    time: '2 hours ago',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'SJ',
  },
  {
    user: 'Michael Chen',
    action: 'posted a new notice about the upcoming sports day',
    time: '4 hours ago',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'MC',
  },
  {
    user: 'Emily Davis',
    action: 'added new photos to the gallery',
    time: '5 hours ago',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'ED',
  },
  {
    user: 'Robert Wilson',
    action: 'updated the exam schedule',
    time: '1 day ago',
    avatar: '/placeholder.svg?height=32&width=32',
    initials: 'RW',
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar} alt={activity.user} />
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
