import "@typespec/http";

using TypeSpec.Http;

@service
namespace PetStore;

model Pet {
  id: int32;
  name: string;
  age: int32;
  species: string;
}

model NewPet {
  name: string;
  age: int32;
  species: string;
}

model Error {
  code: int32;
  message: string;
}

@route("/pets")
interface Pets {
  @get
  list(@query limit?: int32): Pet[];

  @post
  create(@body pet: NewPet): Pet;

  @get
  @route("/{petId}")
  get(@path petId: int32): Pet;

  @put
  @route("/{petId}")
  update(@path petId: int32, @body pet: Pet): Pet;

  @delete
  @route("/{petId}")
  delete(@path petId: int32): void;
}
