class ToDo {

    constructor(url) {
        this.url = url || '/data1.json'
        this.container = null
        this.tasks = null
        this.isLoading = true
        this.hasError = false

        this.loadTasks()
    }

    loadTasks() {
        return fetchData(
            this.url,
            {
                startCallback: () => {
                    this.isLoading = true
                    this.hasError = false
                },
                catchCallback: (error) => {
                    this.hasError = error
                },
                endCallback: () => {
                    this.isLoading = false
                },
            })
            .then((data) => {
                const tasks = data && data.tasks
                this.setTasks(tasks || [])
            })
        // return JSON.parse(localStorage.getItem(this.storageKey))
    }

    setTasks(newTasks) {
        this.tasks = newTasks

        // we cant save items without knowledge about REST API
        // localStorage.setItem(this.storageKey, JSON.stringify(this.tasks))

        this.render()
    }

    deleteTask(indexToDelete) {
        const newTasks = this.tasks.filter((taskData, index) => {
            return index !== indexToDelete
        })
        this.setTasks(newTasks)
    }

    addTask(text) {
        const newTaskData = {
            text: text,
            isComplited: false,
        }

        const newTasks = this.tasks.concat(newTaskData)
        this.setTasks(newTasks)
    }

    toggleComplite(indexToComplite) {
        const newTasks = this.tasks.map((taskData, index) => {
            if (index !== indexToComplite) return taskData
            return {
                text: taskData.text,
                isComplited: !taskData.isComplited
            }
        })
        this.setTasks(newTasks)
    }

    renderTasks() {
        if (this.isLoading) {
            const message = new Message('Loading...')
            this.container.appendChild(message.render()
            )
            return
        }

        if (this.hasError) {
            const message = new Message('Error ocurred!')
            this.container.appendChild(message.render()
            )
            return
        }

        if (this.tasks.length === 0) {
            const message = new Message('Nothing here')
            this.container.appendChild(message.render()
            )
            return
        }

        this.tasks.forEach((taskData, index) => {
            const task = new Task(
                taskData,
                () => this.toggleComplite(index),
                () => this.deleteTask(index)
            )
            this.container.appendChild(task.render())
        })

    }

    render() {
        if (this.container === null) {
            this.container = document.createElement('div')
        }

        this.container.innerHTML = ''

        const form = new Form('', (value) => this.addTask(value))

        this.container.appendChild(form.render())


        this.renderTasks()

        return this.container
    }

}