import Analytics from 'analytics-node'

interface TrackProps {
  id: string
  event: string
}

interface IdentifyProps {
  id: string
  name?: string
  email: string
  username: string
}

const analytics = new Analytics(process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY as string);

const track = ({
  id,
  event,
}: TrackProps) => analytics.track({
  event,
  userId: id,
});

const identify = ({
  id,
  email,
  username
}: IdentifyProps) => analytics.identify({
  userId: id,
  traits: {
    email,
    username,
    createdAt: new Date(),
  }
});

export default ({
  track,
  identify
})
