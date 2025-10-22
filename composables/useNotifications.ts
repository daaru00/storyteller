export default function(seconds = 5) {
  const notifications = useState('notifications', (): Object[] => [])

  const sendNotification = (title: string, color: '') => {
    notifications.value.push({
      title, 
      color
    })

    setTimeout(() => {
      notifications.value.shift()
    }, seconds * 1000)
  }

  return {
    notifications,
    sendNotification
  }
}
