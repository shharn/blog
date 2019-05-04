package repository

type Disposable interface {
	Dispose()
}

type Transactional interface {
	Commit()
	Rollback()
	Disposable
}

type Contextual interface {
	Context() interface{}
}