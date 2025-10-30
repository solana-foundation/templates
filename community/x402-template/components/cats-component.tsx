import Image from 'next/image'

const CAT_GIFS_EXPENSIVE = [
  {
    url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2QzeW5ydnFvbHVqMDIwZ3RmbGhmajg5dzM4Z3UxNHhqMHY4MXFpdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w2JmkbOHFoq8U/giphy.gif',
    caption: 'You made it! 🐱💰',
  },
  {
    url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3hqZ3VlY3AxMmQ5dW41dzdkdHRyZmpmM3F5bWQ2ZnoyY2xraTVnaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eDdEiM0Jq8Ene/giphy.gif',
    caption: 'Party time! 🎉🐱',
  },
  {
    url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnUxM25mMjNobzNoY2Rjc2c4NDFnNm5qMjZhcXFyYmwwZHB5Y2VuMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ND6xkVPaj8tHO/giphy.gif',
    caption: "Don't touch my money! 💵🐱",
  },
  {
    url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjl6ajN4Znh1anl3dDE1NHVqZThlMWVsOGRwNjBxeG9lNXdzMnQ1ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cLLgfNJiKppgA/giphy.gif',
    caption: 'Thanks for your payment! 🎊🐱',
  },
]

const CAT_GIFS_CHEAP = [
  {
    url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmY5Znpmd3BpeHh3MDhraXpmbzJpajJvZWpvM210Y2cwMzZnOXppZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gCL5fOMAVijWE/giphy.gif',
    caption: 'Poor cat! 🐱',
  },
  {
    url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHpzN3F1cWNtNnk2MTc5M3N2YmhyNDdpdnd3empzZnVkeDVxNTV6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qLuH5N5J1sMVy/giphy.gif',
    caption: 'Can you feed me? 😿',
  },
  {
    url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2Fwamo1cHJpeWd0c2d6d2tqdTBlM3lkZGkyZXdqNnV1ejBkdGl2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fYLrVmLXG9tVL4Aykg/giphy.gif',
    caption: 'AAAAAAAAHHH!! 😿',
  },
  {
    url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTdvOWU4MDNobnA4c2ZqdjFxMXRsY3d4aDZlN2dybGxpdGJkeDlvcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6ELoJNHlBQlEci6593/giphy.gif',
    caption: 'Pay me, human! 😾',
  },
]

const getRandomIndex = (length: number) => Math.floor(Math.random() * length)

const randomIndexExpensive = getRandomIndex(CAT_GIFS_EXPENSIVE.length)
const randomIndexCheap = getRandomIndex(CAT_GIFS_CHEAP.length)

export const CatsComponent = ({ contentType = 'expensive' }: { contentType?: 'cheap' | 'expensive' }) => {
  const catGifs = contentType === 'cheap' ? CAT_GIFS_CHEAP : CAT_GIFS_EXPENSIVE
  const randomIndex = contentType === 'cheap' ? randomIndexCheap : randomIndexExpensive
  const selectedCat = catGifs[randomIndex]

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={selectedCat.url} alt={selectedCat.caption} width={400} height={400} />
      <p className="text-sm text-gray-600">{selectedCat.caption}</p>
    </div>
  )
}
